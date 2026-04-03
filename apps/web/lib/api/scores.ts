import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db.js";
import { scores, seasons } from "@jordan-kids/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { PERMISSIONS } from "@jordan-kids/shared";
import {
  auth,
  requirePermission,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const awardScoreSchema = z.object({
  userId: z.number().int().positive(),
  seasonId: z.number().int().positive(),
  category: z.enum(["attendance", "reading", "game", "activity"]),
  activityKey: z.string().min(1).max(100),
  points: z.number().int(),
  metadata: z.record(z.unknown()).optional(),
});

const scoresRoutes = new Hono<AuthEnv>();

scoresRoutes.use("*", auth());

// GET /scores - user's scores (or filter by userId if admin)
scoresRoutes.get("/", async (c) => {
  try {
    const user = c.get("user");
    const queryUserId = c.req.query("userId");
    const querySeasonId = c.req.query("seasonId");

    let targetUserId = user.id;
    if (queryUserId) {
      const parsed = parseInt(queryUserId, 10);
      if (!isNaN(parsed)) {
        if (
          parsed !== user.id &&
          !user.permissions.includes(PERMISSIONS.MANAGE_SCORES) &&
          !user.permissions.includes(PERMISSIONS.VIEW_REPORTS)
        ) {
          return c.json({ success: false, error: "Forbidden" }, 403);
        }
        targetUserId = parsed;
      }
    }

    const conditions = [eq(scores.userId, targetUserId)];
    if (querySeasonId) {
      const sid = parseInt(querySeasonId, 10);
      if (!isNaN(sid)) {
        conditions.push(eq(scores.seasonId, sid));
      }
    }

    const result = await db
      .select()
      .from(scores)
      .where(and(...conditions))
      .orderBy(desc(scores.createdAt));

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List scores error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /scores/summary/:userId - score summary by category
scoresRoutes.get("/summary/:userId", async (c) => {
  try {
    const userId = parseInt(c.req.param("userId"), 10);
    if (isNaN(userId)) {
      return c.json({ success: false, error: "Invalid user ID" }, 400);
    }

    const user = c.get("user");
    if (
      userId !== user.id &&
      !user.permissions.includes(PERMISSIONS.MANAGE_SCORES) &&
      !user.permissions.includes(PERMISSIONS.VIEW_REPORTS)
    ) {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    // Find active season
    const activeSeason = await db
      .select()
      .from(seasons)
      .where(eq(seasons.isActive, true))
      .limit(1);

    const seasonId = activeSeason[0]?.id;
    if (!seasonId) {
      return c.json({
        success: true,
        data: { userId, seasonId: null, totalPoints: 0, byCategory: [], badgesEarned: 0, rank: 0 },
      });
    }

    // Get scores by category
    const byCategory = await db
      .select({
        category: scores.category,
        points: sql<number>`SUM(${scores.points})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(scores)
      .where(and(eq(scores.userId, userId), eq(scores.seasonId, seasonId)))
      .groupBy(scores.category);

    const totalPoints = byCategory.reduce((sum, cat) => sum + Number(cat.points), 0);

    // Get rank
    const rankResult = await db
      .select({
        userId: scores.userId,
        total: sql<number>`SUM(${scores.points})`,
      })
      .from(scores)
      .where(eq(scores.seasonId, seasonId))
      .groupBy(scores.userId)
      .orderBy(desc(sql`SUM(${scores.points})`));

    const rank = rankResult.findIndex((r) => r.userId === userId) + 1;

    return c.json({
      success: true,
      data: {
        userId,
        seasonId,
        totalPoints,
        byCategory: byCategory.map((cat) => ({
          category: cat.category,
          points: Number(cat.points),
          count: Number(cat.count),
        })),
        badgesEarned: 0, // Would need a separate query
        rank: rank || 0,
      },
    });
  } catch (err) {
    console.error("Score summary error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /scores - award points (admin, leader)
scoresRoutes.post(
  "/",
  requirePermission(PERMISSIONS.MANAGE_SCORES),
  auditLogMiddleware("award_score"),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = awardScoreSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const user = c.get("user");

      const [score] = await db
        .insert(scores)
        .values({
          userId: parsed.data.userId,
          seasonId: parsed.data.seasonId,
          category: parsed.data.category,
          activityKey: parsed.data.activityKey,
          points: parsed.data.points,
          metadata: parsed.data.metadata ?? {},
          awardedBy: user.id,
        })
        .returning();

      return c.json({ success: true, data: score }, 201);
    } catch (err) {
      console.error("Award score error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// DELETE /scores/:id - revert points (admin)
scoresRoutes.delete(
  "/:id",
  requirePermission(PERMISSIONS.MANAGE_SCORES),
  auditLogMiddleware("revert_score"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid score ID" }, 400);
      }

      const [deleted] = await db
        .delete(scores)
        .where(eq(scores.id, id))
        .returning();

      if (!deleted) {
        return c.json({ success: false, error: "Score not found" }, 404);
      }

      return c.json({ success: true, data: { reverted: deleted } });
    } catch (err) {
      console.error("Revert score error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

export { scoresRoutes };
