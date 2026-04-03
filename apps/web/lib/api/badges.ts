import { Hono } from "hono";
import { db } from "../db.js";
import {
  badges,
  badgesEarned,
  seasons,
  scores,
  readingProgress,
  users,
} from "@jordan-kids/db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import {
  auth,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const badgesRoutes = new Hono<AuthEnv>();

badgesRoutes.use("*", auth());

// GET /badges - badge catalog
badgesRoutes.get("/", async (c) => {
  try {
    const result = await db
      .select()
      .from(badges)
      .orderBy(badges.tier, badges.name);

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List badges error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /badges/earned - user's earned badges
badgesRoutes.get("/earned", async (c) => {
  try {
    const user = c.get("user");
    const queryUserId = c.req.query("userId");
    const uid = queryUserId ? parseInt(queryUserId, 10) : user.id;

    if (isNaN(uid)) {
      return c.json({ success: false, error: "Invalid user ID" }, 400);
    }

    const result = await db
      .select({
        id: badgesEarned.id,
        badgeId: badgesEarned.badgeId,
        seasonId: badgesEarned.seasonId,
        earnedAt: badgesEarned.earnedAt,
        badgeName: badges.name,
        badgeSlug: badges.slug,
        badgeDescription: badges.description,
        badgeIconUrl: badges.iconUrl,
        badgeTier: badges.tier,
      })
      .from(badgesEarned)
      .innerJoin(badges, eq(badgesEarned.badgeId, badges.id))
      .where(eq(badgesEarned.userId, uid))
      .orderBy(desc(badgesEarned.earnedAt));

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("Earned badges error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /badges/check - evaluate and award pending badges for the current user
badgesRoutes.post(
  "/check",
  auditLogMiddleware("check_badges"),
  async (c) => {
    try {
      const user = c.get("user");

      // Get active season
      const activeSeason = await db
        .select()
        .from(seasons)
        .where(eq(seasons.isActive, true))
        .limit(1);

      if (!activeSeason[0]) {
        return c.json({ success: true, data: { awarded: [] } });
      }

      const seasonId = activeSeason[0].id;
      const awarded: string[] = [];

      // Get all badges
      const allBadges = await db.select().from(badges);

      // Get already earned badges for this user+season
      const earnedRows = await db
        .select({ badgeId: badgesEarned.badgeId })
        .from(badgesEarned)
        .where(
          and(eq(badgesEarned.userId, user.id), eq(badgesEarned.seasonId, seasonId))
        );
      const earnedSet = new Set(earnedRows.map((r) => r.badgeId));

      for (const badge of allBadges) {
        if (earnedSet.has(badge.id)) continue;

        const criteria = badge.criteria as { type?: string; threshold?: number } | null;
        if (!criteria || !criteria.type || !criteria.threshold) continue;

        let qualified = false;

        if (criteria.type === "readings_completed") {
          const result = await db
            .select({ total: count() })
            .from(readingProgress)
            .where(
              and(
                eq(readingProgress.userId, user.id),
                eq(readingProgress.status, "completed")
              )
            );
          qualified = (result[0]?.total ?? 0) >= criteria.threshold;
        } else if (criteria.type === "correct_answers") {
          const result = await db
            .select({
              totalCorrect: sql<number>`COALESCE(SUM((metadata->>'correctAnswers')::int), 0)`,
            })
            .from(scores)
            .where(
              and(eq(scores.userId, user.id), eq(scores.category, "game"))
            );
          qualified = (result[0]?.totalCorrect ?? 0) >= criteria.threshold;
        } else if (criteria.type === "season_top") {
          // Check if user is in top N for the season
          const rankResult = await db
            .select({
              userId: scores.userId,
              total: sql<number>`SUM(${scores.points})`,
            })
            .from(scores)
            .where(eq(scores.seasonId, seasonId))
            .groupBy(scores.userId)
            .orderBy(desc(sql`SUM(${scores.points})`))
            .limit(criteria.threshold);

          qualified = rankResult.some((r) => r.userId === user.id);
        }

        if (qualified) {
          await db
            .insert(badgesEarned)
            .values({
              userId: user.id,
              badgeId: badge.id,
              seasonId,
            })
            .onConflictDoNothing();
          awarded.push(badge.name);
        }
      }

      return c.json({ success: true, data: { awarded } });
    } catch (err) {
      console.error("Check badges error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

export { badgesRoutes };
