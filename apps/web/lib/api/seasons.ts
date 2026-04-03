import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db.js";
import { seasons } from "@jordan-kids/db";
import { eq } from "drizzle-orm";
import { PERMISSIONS } from "@jordan-kids/shared";
import {
  auth,
  requirePermission,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const createSeasonSchema = z.object({
  name: z.string().min(1).max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isActive: z.boolean().optional(),
});

const updateSeasonSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const seasonsRoutes = new Hono<AuthEnv>();

seasonsRoutes.use("*", auth());

// GET /seasons
seasonsRoutes.get("/", async (c) => {
  try {
    const result = await db
      .select()
      .from(seasons)
      .orderBy(seasons.createdAt);

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List seasons error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /seasons/:id
seasonsRoutes.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid season ID" }, 400);
    }

    const result = await db
      .select()
      .from(seasons)
      .where(eq(seasons.id, id))
      .limit(1);

    const season = result[0];
    if (!season) {
      return c.json({ success: false, error: "Season not found" }, 404);
    }

    return c.json({ success: true, data: season });
  } catch (err) {
    console.error("Get season error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /seasons
seasonsRoutes.post(
  "/",
  requirePermission(PERMISSIONS.MANAGE_SEASONS),
  auditLogMiddleware("create_season"),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = createSeasonSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const user = c.get("user");
      const { name, startDate, endDate, isActive } = parsed.data;

      const [season] = await db
        .insert(seasons)
        .values({
          name,
          startDate,
          endDate,
          isActive: isActive ?? false,
          createdBy: user.id,
        })
        .returning();

      return c.json({ success: true, data: season }, 201);
    } catch (err) {
      console.error("Create season error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// PUT /seasons/:id
seasonsRoutes.put(
  "/:id",
  requirePermission(PERMISSIONS.MANAGE_SEASONS),
  auditLogMiddleware("update_season"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid season ID" }, 400);
      }

      const body = await c.req.json();
      const parsed = updateSeasonSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const update: Record<string, unknown> = {};
      if (parsed.data.name !== undefined) update.name = parsed.data.name;
      if (parsed.data.startDate !== undefined) update.startDate = parsed.data.startDate;
      if (parsed.data.endDate !== undefined) update.endDate = parsed.data.endDate;

      if (Object.keys(update).length === 0) {
        return c.json({ success: false, error: "No fields to update" }, 400);
      }

      const [updated] = await db
        .update(seasons)
        .set(update)
        .where(eq(seasons.id, id))
        .returning();

      if (!updated) {
        return c.json({ success: false, error: "Season not found" }, 404);
      }

      return c.json({ success: true, data: updated });
    } catch (err) {
      console.error("Update season error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// DELETE /seasons/:id
seasonsRoutes.delete(
  "/:id",
  requirePermission(PERMISSIONS.MANAGE_SEASONS),
  auditLogMiddleware("delete_season"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid season ID" }, 400);
      }

      const [deleted] = await db
        .delete(seasons)
        .where(eq(seasons.id, id))
        .returning({ id: seasons.id });

      if (!deleted) {
        return c.json({ success: false, error: "Season not found" }, 404);
      }

      return c.json({ success: true, data: null });
    } catch (err) {
      console.error("Delete season error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// POST /seasons/:id/activate
seasonsRoutes.post(
  "/:id/activate",
  requirePermission(PERMISSIONS.MANAGE_SEASONS),
  auditLogMiddleware("activate_season"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid season ID" }, 400);
      }

      // Deactivate all seasons first
      await db.update(seasons).set({ isActive: false });

      // Activate the target season
      const [activated] = await db
        .update(seasons)
        .set({ isActive: true })
        .where(eq(seasons.id, id))
        .returning();

      if (!activated) {
        return c.json({ success: false, error: "Season not found" }, 404);
      }

      return c.json({ success: true, data: activated });
    } catch (err) {
      console.error("Activate season error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// POST /seasons/:id/close
seasonsRoutes.post(
  "/:id/close",
  requirePermission(PERMISSIONS.MANAGE_SEASONS),
  auditLogMiddleware("close_season"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid season ID" }, 400);
      }

      const [closed] = await db
        .update(seasons)
        .set({ isActive: false })
        .where(eq(seasons.id, id))
        .returning();

      if (!closed) {
        return c.json({ success: false, error: "Season not found" }, 404);
      }

      return c.json({ success: true, data: closed });
    } catch (err) {
      console.error("Close season error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

export { seasonsRoutes };
