import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db.js";
import { readings, readingProgress, scores, badges, badgesEarned, seasons } from "@jordan-kids/db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { PERMISSIONS } from "@jordan-kids/shared";
import {
  auth,
  requirePermission,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const createReadingSchema = z.object({
  title: z.string().min(1).max(200),
  bibleReference: z.string().min(1).max(100),
  content: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  pointsValue: z.number().int().positive().optional(),
  seasonId: z.number().int().positive(),
});

const updateReadingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  bibleReference: z.string().min(1).max(100).optional(),
  content: z.string().nullable().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  pointsValue: z.number().int().positive().optional(),
});

const readingsRoutes = new Hono<AuthEnv>();

readingsRoutes.use("*", auth());

// GET /readings
readingsRoutes.get("/", async (c) => {
  try {
    const seasonId = c.req.query("seasonId");

    let query = db.select().from(readings).orderBy(desc(readings.createdAt)).$dynamic();

    if (seasonId) {
      const sid = parseInt(seasonId, 10);
      if (!isNaN(sid)) {
        query = query.where(eq(readings.seasonId, sid));
      }
    }

    const result = await query;
    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List readings error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /readings/progress - user's reading progress
readingsRoutes.get("/progress", async (c) => {
  try {
    const user = c.get("user");
    const targetUserId = c.req.query("userId");
    const uid = targetUserId ? parseInt(targetUserId, 10) : user.id;

    if (uid !== user.id && !user.permissions.includes(PERMISSIONS.MANAGE_READINGS)) {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    const result = await db
      .select({
        id: readingProgress.id,
        readingId: readingProgress.readingId,
        status: readingProgress.status,
        completedAt: readingProgress.completedAt,
        readingTitle: readings.title,
        bibleReference: readings.bibleReference,
        difficulty: readings.difficulty,
        pointsValue: readings.pointsValue,
      })
      .from(readingProgress)
      .innerJoin(readings, eq(readingProgress.readingId, readings.id))
      .where(eq(readingProgress.userId, uid))
      .orderBy(desc(readingProgress.createdAt));

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("Reading progress error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /readings/:id
readingsRoutes.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid reading ID" }, 400);
    }

    const result = await db
      .select()
      .from(readings)
      .where(eq(readings.id, id))
      .limit(1);

    const reading = result[0];
    if (!reading) {
      return c.json({ success: false, error: "Reading not found" }, 404);
    }

    return c.json({ success: true, data: reading });
  } catch (err) {
    console.error("Get reading error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /readings
readingsRoutes.post(
  "/",
  requirePermission(PERMISSIONS.MANAGE_READINGS),
  auditLogMiddleware("create_reading"),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = createReadingSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const user = c.get("user");

      const [reading] = await db
        .insert(readings)
        .values({
          title: parsed.data.title,
          bibleReference: parsed.data.bibleReference,
          content: parsed.data.content ?? null,
          difficulty: parsed.data.difficulty ?? "easy",
          pointsValue: parsed.data.pointsValue ?? 5,
          seasonId: parsed.data.seasonId,
          createdBy: user.id,
        })
        .returning();

      return c.json({ success: true, data: reading }, 201);
    } catch (err) {
      console.error("Create reading error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// PUT /readings/:id
readingsRoutes.put(
  "/:id",
  requirePermission(PERMISSIONS.MANAGE_READINGS),
  auditLogMiddleware("update_reading"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid reading ID" }, 400);
      }

      const body = await c.req.json();
      const parsed = updateReadingSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const update: Record<string, unknown> = {};
      const d = parsed.data;
      if (d.title !== undefined) update.title = d.title;
      if (d.bibleReference !== undefined) update.bibleReference = d.bibleReference;
      if (d.content !== undefined) update.content = d.content;
      if (d.difficulty !== undefined) update.difficulty = d.difficulty;
      if (d.pointsValue !== undefined) update.pointsValue = d.pointsValue;

      if (Object.keys(update).length === 0) {
        return c.json({ success: false, error: "No fields to update" }, 400);
      }

      const [updated] = await db
        .update(readings)
        .set(update)
        .where(eq(readings.id, id))
        .returning();

      if (!updated) {
        return c.json({ success: false, error: "Reading not found" }, 404);
      }

      return c.json({ success: true, data: updated });
    } catch (err) {
      console.error("Update reading error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// DELETE /readings/:id
readingsRoutes.delete(
  "/:id",
  requirePermission(PERMISSIONS.MANAGE_READINGS),
  auditLogMiddleware("delete_reading"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid reading ID" }, 400);
      }

      const [deleted] = await db
        .delete(readings)
        .where(eq(readings.id, id))
        .returning({ id: readings.id });

      if (!deleted) {
        return c.json({ success: false, error: "Reading not found" }, 404);
      }

      return c.json({ success: true, data: null });
    } catch (err) {
      console.error("Delete reading error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// POST /readings/:id/complete - mark reading as completed, award points
readingsRoutes.post(
  "/:id/complete",
  auditLogMiddleware("complete_reading"),
  async (c) => {
    try {
      const readingId = parseInt(c.req.param("id"), 10);
      if (isNaN(readingId)) {
        return c.json({ success: false, error: "Invalid reading ID" }, 400);
      }

      const user = c.get("user");

      // Get reading info
      const readingRows = await db
        .select()
        .from(readings)
        .where(eq(readings.id, readingId))
        .limit(1);

      const reading = readingRows[0];
      if (!reading) {
        return c.json({ success: false, error: "Reading not found" }, 404);
      }

      // Check if already completed
      const existing = await db
        .select()
        .from(readingProgress)
        .where(
          and(
            eq(readingProgress.userId, user.id),
            eq(readingProgress.readingId, readingId)
          )
        )
        .limit(1);

      if (existing[0]?.status === "completed") {
        return c.json({ success: false, error: "Reading already completed" }, 409);
      }

      const now = new Date();

      if (existing[0]) {
        // Update existing progress
        await db
          .update(readingProgress)
          .set({ status: "completed", completedAt: now })
          .where(eq(readingProgress.id, existing[0].id));
      } else {
        // Create new progress
        await db.insert(readingProgress).values({
          userId: user.id,
          readingId,
          status: "completed",
          completedAt: now,
        });
      }

      // Award points
      await db.insert(scores).values({
        userId: user.id,
        seasonId: reading.seasonId,
        category: "reading",
        activityKey: `reading_${readingId}`,
        points: reading.pointsValue,
        metadata: { readingId, title: reading.title },
        awardedBy: user.id,
      });

      // Check badge eligibility: Primera Lectura (1 reading) and Explorador Biblico (10 readings)
      const completedCount = await db
        .select({ total: count() })
        .from(readingProgress)
        .where(
          and(
            eq(readingProgress.userId, user.id),
            eq(readingProgress.status, "completed")
          )
        );

      const totalCompleted = completedCount[0]?.total ?? 0;

      // Award "Primera Lectura" badge
      if (totalCompleted >= 1) {
        const badge = await db
          .select()
          .from(badges)
          .where(eq(badges.slug, "primera-lectura"))
          .limit(1);

        if (badge[0]) {
          await db
            .insert(badgesEarned)
            .values({
              userId: user.id,
              badgeId: badge[0].id,
              seasonId: reading.seasonId,
            })
            .onConflictDoNothing();
        }
      }

      // Award "Explorador Biblico" badge
      if (totalCompleted >= 10) {
        const badge = await db
          .select()
          .from(badges)
          .where(eq(badges.slug, "explorador-biblico"))
          .limit(1);

        if (badge[0]) {
          await db
            .insert(badgesEarned)
            .values({
              userId: user.id,
              badgeId: badge[0].id,
              seasonId: reading.seasonId,
            })
            .onConflictDoNothing();
        }
      }

      return c.json({
        success: true,
        data: {
          readingId,
          pointsAwarded: reading.pointsValue,
          totalReadingsCompleted: totalCompleted,
        },
      });
    } catch (err) {
      console.error("Complete reading error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

export { readingsRoutes };
