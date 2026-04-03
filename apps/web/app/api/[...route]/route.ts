import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { authRoutes } from "@/lib/api/auth";
import { usersRoutes } from "@/lib/api/users";
import { seasonsRoutes } from "@/lib/api/seasons";
import { gamesRoutes } from "@/lib/api/games";
import { readingsRoutes } from "@/lib/api/readings";
import { scoresRoutes } from "@/lib/api/scores";
import { leaderboardRoutes } from "@/lib/api/leaderboard";
import { badgesRoutes } from "@/lib/api/badges";

const app = new Hono().basePath("/api");

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Mount sub-routers
app.route("/auth", authRoutes);
app.route("/users", usersRoutes);
app.route("/seasons", seasonsRoutes);
app.route("/games", gamesRoutes);
app.route("/readings", readingsRoutes);
app.route("/scores", scoresRoutes);
app.route("/leaderboard", leaderboardRoutes);
app.route("/badges", badgesRoutes);

// 404 fallback
app.notFound((c) => c.json({ success: false, error: "Not found" }, 404));

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled API error:", err);
  return c.json({ success: false, error: "Internal server error" }, 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
