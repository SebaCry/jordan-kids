import { cookies } from "next/headers";
import crypto from "node:crypto";
import { db } from "./db.js";
import { users, roles, rolePermissions, permissions } from "@jordan-kids/db";
import { eq } from "drizzle-orm";
import type { AuthUser } from "@jordan-kids/shared";

export type UserRole = "admin" | "leader" | "parent" | "child";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple token store (in production use Redis or DB-backed sessions)
const tokenStore = new Map<string, { userId: number; expiresAt: number }>();

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    if (!salt || !key) {
      resolve(false);
      return;
    }
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex") === key);
    });
  });
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createSession(userId: number): string {
  const token = generateToken();
  tokenStore.set(token, {
    userId,
    expiresAt: Date.now() + TOKEN_EXPIRY_MS,
  });
  return token;
}

export function deleteSession(token: string): void {
  tokenStore.delete(token);
}

export function refreshSessionToken(token: string): string | null {
  const session = tokenStore.get(token);
  if (!session || session.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return null;
  }
  tokenStore.delete(token);
  return createSession(session.userId);
}

export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  const session = tokenStore.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) tokenStore.delete(token);
    return null;
  }

  const userRows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      roleId: users.roleId,
      avatarUrl: users.avatarUrl,
      isActive: users.isActive,
      roleName: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.roleId, roles.id))
    .where(eq(users.id, session.userId))
    .limit(1);

  const user = userRows[0];
  if (!user || !user.isActive) return null;

  const userPermissions = await db
    .select({ permissionName: permissions.name })
    .from(rolePermissions)
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(rolePermissions.roleId, user.roleId));

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.roleName,
    roleId: user.roleId,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    permissions: userPermissions.map((p) => p.permissionName),
  };
}

// Next.js server-side session helper (for server components / actions)
export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    if (!sessionCookie) return null;

    const user = await getUserFromToken(sessionCookie.value);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      avatarUrl: user.avatarUrl,
    };
  } catch {
    return null;
  }
}

export function canManageChildren(role: UserRole): boolean {
  return role === "admin" || role === "leader";
}

export function canManageScores(role: UserRole): boolean {
  return role === "admin" || role === "leader";
}

export function canManageSeasons(role: UserRole): boolean {
  return role === "admin";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "admin";
}

export function canViewReports(role: UserRole): boolean {
  return role === "admin" || role === "leader";
}
