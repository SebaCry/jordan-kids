import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db.js";
import { hashPassword } from "../auth.js";
import { users, userProfiles, roles } from "@jordan-kids/db";
import { eq } from "drizzle-orm";
import { PERMISSIONS } from "@jordan-kids/shared";
import {
  auth,
  requirePermission,
  requireRole,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100),
  roleId: z.number().int().positive(),
  age: z.number().int().positive().optional(),
  grade: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  parentId: z.number().int().positive().optional(),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
  roleId: z.number().int().positive().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
  age: z.number().int().positive().nullable().optional(),
  grade: z.string().max(50).nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  parentId: z.number().int().positive().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const usersRoutes = new Hono<AuthEnv>();

// All routes require auth
usersRoutes.use("*", auth());

// GET /users - list users
usersRoutes.get("/", requirePermission(PERMISSIONS.MANAGE_USERS), async (c) => {
  try {
    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        roleId: users.roleId,
        roleName: roles.name,
        avatarUrl: users.avatarUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .orderBy(users.name);

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List users error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /users/:id - user detail
usersRoutes.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid user ID" }, 400);
    }

    const currentUser = c.get("user");
    // Users can view their own profile; admins/leaders can view anyone
    if (
      currentUser.id !== id &&
      !currentUser.permissions.includes(PERMISSIONS.MANAGE_USERS) &&
      !currentUser.permissions.includes(PERMISSIONS.MANAGE_CHILDREN)
    ) {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        roleId: users.roleId,
        roleName: roles.name,
        avatarUrl: users.avatarUrl,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        profileId: userProfiles.id,
        age: userProfiles.age,
        grade: userProfiles.grade,
        phone: userProfiles.phone,
        parentId: userProfiles.parentId,
        notes: userProfiles.notes,
      })
      .from(users)
      .innerJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, id))
      .limit(1);

    const user = result[0];
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId,
        roleName: user.roleName,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profile: user.profileId
          ? {
              id: user.profileId,
              age: user.age,
              grade: user.grade,
              phone: user.phone,
              parentId: user.parentId,
              notes: user.notes,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Get user error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /users - create user (admin only)
usersRoutes.post(
  "/",
  requireRole("admin"),
  auditLogMiddleware("create_user"),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = createUserSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const { email, password, name, roleId, age, grade, phone, parentId } = parsed.data;

      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existing.length > 0) {
        return c.json({ success: false, error: "Email already registered" }, 409);
      }

      const passwordHash = await hashPassword(password);

      const [newUser] = await db
        .insert(users)
        .values({ email, passwordHash, name, roleId })
        .returning();

      if (!newUser) {
        return c.json({ success: false, error: "Failed to create user" }, 500);
      }

      await db.insert(userProfiles).values({
        userId: newUser.id,
        age: age ?? null,
        grade: grade ?? null,
        phone: phone ?? null,
        parentId: parentId ?? null,
      });

      return c.json(
        { success: true, data: { id: newUser.id, email: newUser.email, name: newUser.name } },
        201
      );
    } catch (err) {
      console.error("Create user error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// PUT /users/:id - update user
usersRoutes.put("/:id", auditLogMiddleware("update_user"), async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid user ID" }, 400);
    }

    const currentUser = c.get("user");
    // Only admins can update other users; users can update themselves
    if (currentUser.id !== id && currentUser.role !== "admin") {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    const body = await c.req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
        400
      );
    }

    const { email, name, roleId, avatarUrl, isActive, age, grade, phone, parentId, notes } =
      parsed.data;

    // Build user update
    const userUpdate: Record<string, unknown> = { updatedAt: new Date() };
    if (email !== undefined) userUpdate.email = email;
    if (name !== undefined) userUpdate.name = name;
    if (roleId !== undefined && currentUser.role === "admin") userUpdate.roleId = roleId;
    if (avatarUrl !== undefined) userUpdate.avatarUrl = avatarUrl;
    if (isActive !== undefined && currentUser.role === "admin") userUpdate.isActive = isActive;

    const [updated] = await db
      .update(users)
      .set(userUpdate)
      .where(eq(users.id, id))
      .returning();

    if (!updated) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Update profile if profile fields provided
    const profileUpdate: Record<string, unknown> = {};
    if (age !== undefined) profileUpdate.age = age;
    if (grade !== undefined) profileUpdate.grade = grade;
    if (phone !== undefined) profileUpdate.phone = phone;
    if (parentId !== undefined) profileUpdate.parentId = parentId;
    if (notes !== undefined) profileUpdate.notes = notes;

    if (Object.keys(profileUpdate).length > 0) {
      profileUpdate.updatedAt = new Date();
      // Upsert profile
      const existingProfile = await db
        .select({ id: userProfiles.id })
        .from(userProfiles)
        .where(eq(userProfiles.userId, id))
        .limit(1);

      if (existingProfile.length > 0) {
        await db
          .update(userProfiles)
          .set(profileUpdate)
          .where(eq(userProfiles.userId, id));
      } else {
        await db.insert(userProfiles).values({
          userId: id,
          ...profileUpdate,
        });
      }
    }

    return c.json({ success: true, data: { id: updated.id, email: updated.email, name: updated.name } });
  } catch (err) {
    console.error("Update user error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// DELETE /users/:id - delete user (admin only)
usersRoutes.delete(
  "/:id",
  requireRole("admin"),
  auditLogMiddleware("delete_user"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid user ID" }, 400);
      }

      const currentUser = c.get("user");
      if (currentUser.id === id) {
        return c.json({ success: false, error: "Cannot delete your own account" }, 400);
      }

      const [deleted] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });

      if (!deleted) {
        return c.json({ success: false, error: "User not found" }, 404);
      }

      return c.json({ success: true, data: null });
    } catch (err) {
      console.error("Delete user error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// GET /users/:id/children - children of a parent
usersRoutes.get("/:id/children", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid user ID" }, 400);
    }

    const currentUser = c.get("user");
    if (
      currentUser.id !== id &&
      !currentUser.permissions.includes(PERMISSIONS.MANAGE_USERS) &&
      !currentUser.permissions.includes(PERMISSIONS.MANAGE_CHILDREN)
    ) {
      return c.json({ success: false, error: "Forbidden" }, 403);
    }

    const children = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        age: userProfiles.age,
        grade: userProfiles.grade,
      })
      .from(userProfiles)
      .innerJoin(users, eq(userProfiles.userId, users.id))
      .where(eq(userProfiles.parentId, id));

    return c.json({ success: true, data: children });
  } catch (err) {
    console.error("Get children error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

export { usersRoutes };
