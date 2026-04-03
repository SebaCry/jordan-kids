import { Hono } from "hono";
import { setCookie, deleteCookie, getCookie } from "hono/cookie";
import { z } from "zod";
import { db } from "../db.js";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  refreshSessionToken,
  getUserFromToken,
} from "../auth.js";
import { users, userProfiles, roles } from "@jordan-kids/db";
import { eq } from "drizzle-orm";
import { auth, type AuthEnv } from "./middleware.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(100),
  roleId: z.number().int().positive().optional(),
  age: z.number().int().positive().optional(),
  grade: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  parentId: z.number().int().positive().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authRoutes = new Hono<AuthEnv>();

// POST /auth/register
authRoutes.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
        400
      );
    }

    const { email, password, name, roleId, age, grade, phone, parentId } = parsed.data;

    // Check if email exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return c.json({ success: false, error: "Email already registered" }, 409);
    }

    // Default to child role if none specified
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const childRole = await db
        .select({ id: roles.id })
        .from(roles)
        .where(eq(roles.name, "child"))
        .limit(1);
      finalRoleId = childRole[0]?.id ?? 4;
    }

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
        roleId: finalRoleId,
      })
      .returning();

    if (!newUser) {
      return c.json({ success: false, error: "Failed to create user" }, 500);
    }

    // Create profile
    await db.insert(userProfiles).values({
      userId: newUser.id,
      age: age ?? null,
      grade: grade ?? null,
      phone: phone ?? null,
      parentId: parentId ?? null,
    });

    // Create session
    const token = createSession(newUser.id);
    setCookie(c, "session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const authUser = await getUserFromToken(token);

    return c.json({ success: true, data: { user: authUser } }, 201);
  } catch (err) {
    console.error("Register error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /auth/login
authRoutes.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
        400
      );
    }

    const { email, password } = parsed.data;

    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = userRows[0];
    if (!user) {
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }

    if (!user.isActive) {
      return c.json({ success: false, error: "Account is deactivated" }, 403);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }

    const token = createSession(user.id);
    setCookie(c, "session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    const authUser = await getUserFromToken(token);

    return c.json({ success: true, data: { user: authUser } });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /auth/logout
authRoutes.post("/logout", async (c) => {
  const token = getCookie(c, "session");
  if (token) {
    deleteSession(token);
  }
  deleteCookie(c, "session", { path: "/" });
  return c.json({ success: true, data: null });
});

// POST /auth/refresh
authRoutes.post("/refresh", async (c) => {
  const token = getCookie(c, "session");
  if (!token) {
    return c.json({ success: false, error: "No session" }, 401);
  }

  const newToken = refreshSessionToken(token);
  if (!newToken) {
    deleteCookie(c, "session", { path: "/" });
    return c.json({ success: false, error: "Session expired" }, 401);
  }

  setCookie(c, "session", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  const authUser = await getUserFromToken(newToken);
  return c.json({ success: true, data: { user: authUser } });
});

// GET /auth/me
authRoutes.get("/me", auth(), async (c) => {
  const user = c.get("user");
  return c.json({ success: true, data: { user } });
});

export { authRoutes };
