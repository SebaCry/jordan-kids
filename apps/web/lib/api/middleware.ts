import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { getUserFromToken } from "../auth.js";
import { db } from "../db.js";
import { auditLog } from "@jordan-kids/db";
import type { AuthUser } from "@jordan-kids/shared";

// Extend Hono context to include the authenticated user
export type AuthEnv = {
  Variables: {
    user: AuthUser;
  };
};

export const auth = () =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const token =
      getCookie(c, "session") ??
      c.req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return c.json({ success: false, error: "Authentication required" }, 401);
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return c.json({ success: false, error: "Invalid or expired session" }, 401);
    }

    c.set("user", user);
    await next();
  });

export const requirePermission = (permission: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ success: false, error: "Authentication required" }, 401);
    }

    if (!user.permissions.includes(permission)) {
      return c.json(
        { success: false, error: `Missing permission: ${permission}` },
        403
      );
    }

    await next();
  });

export const requireRole = (...allowedRoles: string[]) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ success: false, error: "Authentication required" }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json(
        { success: false, error: `Role '${user.role}' is not authorized` },
        403
      );
    }

    await next();
  });

export const auditLogMiddleware = (action: string) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    await next();

    // Log after the handler executes
    const user = c.get("user");
    if (!user) return;

    try {
      const url = new URL(c.req.url);
      const pathParts = url.pathname.split("/").filter(Boolean);
      // Try to extract target info from path (e.g., /api/users/5 -> type=users, id=5)
      let targetType: string | undefined;
      let targetId: number | undefined;

      // Walk path segments to find resource type and numeric id
      for (let i = 0; i < pathParts.length; i++) {
        const segment = pathParts[i]!;
        const nextSegment = pathParts[i + 1];
        if (segment !== "api" && isNaN(Number(segment))) {
          targetType = segment;
          if (nextSegment && !isNaN(Number(nextSegment))) {
            targetId = parseInt(nextSegment, 10);
          }
        }
      }

      await db.insert(auditLog).values({
        actorId: user.id,
        action,
        targetType: targetType ?? null,
        targetId: targetId ?? null,
        details: {
          method: c.req.method,
          path: url.pathname,
          status: c.res.status,
        },
      });
    } catch (err) {
      console.error("Audit log error:", err);
    }
  });
