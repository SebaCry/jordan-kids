import { Hono } from "hono";
import { db } from "../db.js";
import { scores, seasons, users, gameSessions, readingProgress } from "@jordan-kids/db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { auth, type AuthEnv } from "./middleware.js";

const leaderboardRoutes = new Hono<AuthEnv>();

leaderboardRoutes.use("*", auth());

// GET /leaderboard - active season leaderboard
leaderboardRoutes.get("/", async (c) => {
  try {
    const activeSeason = await db
      .select()
      .from(seasons)
      .where(eq(seasons.isActive, true))
      .limit(1);

    if (!activeSeason[0]) {
      return c.json({ success: true, data: [] });
    }

    return getLeaderboardBySeason(c, activeSeason[0].id);
  } catch (err) {
    console.error("Leaderboard error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /leaderboard/season/:id - specific season leaderboard
leaderboardRoutes.get("/season/:id", async (c) => {
  try {
    const seasonId = parseInt(c.req.param("id"), 10);
    if (isNaN(seasonId)) {
      return c.json({ success: false, error: "Invalid season ID" }, 400);
    }

    const season = await db
      .select()
      .from(seasons)
      .where(eq(seasons.id, seasonId))
      .limit(1);

    if (!season[0]) {
      return c.json({ success: false, error: "Season not found" }, 404);
    }

    return getLeaderboardBySeason(c, seasonId);
  } catch (err) {
    console.error("Season leaderboard error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

async function getLeaderboardBySeason(c: any, seasonId: number) {
  // Get aggregated scores per user
  const scoreRows = await db
    .select({
      userId: scores.userId,
      userName: users.name,
      avatarUrl: users.avatarUrl,
      totalPoints: sql<number>`SUM(${scores.points})`,
    })
    .from(scores)
    .innerJoin(users, eq(scores.userId, users.id))
    .where(eq(scores.seasonId, seasonId))
    .groupBy(scores.userId, users.name, users.avatarUrl)
    .orderBy(desc(sql`SUM(${scores.points})`))
    .limit(100);

  // Get game counts per user for this season
  const gameCounts = await db
    .select({
      userId: gameSessions.userId,
      gamesPlayed: count(gameSessions.id),
    })
    .from(gameSessions)
    .where(eq(gameSessions.seasonId, seasonId))
    .groupBy(gameSessions.userId);

  const gameCountMap = new Map(gameCounts.map((g) => [g.userId, Number(g.gamesPlayed)]));

  // Get reading completion counts per user
  const readingCounts = await db
    .select({
      userId: readingProgress.userId,
      readingsCompleted: count(readingProgress.id),
    })
    .from(readingProgress)
    .where(eq(readingProgress.status, "completed"))
    .groupBy(readingProgress.userId);

  const readingCountMap = new Map(readingCounts.map((r) => [r.userId, Number(r.readingsCompleted)]));

  const leaderboard = scoreRows.map((row, index) => ({
    rank: index + 1,
    userId: row.userId,
    userName: row.userName,
    avatarUrl: row.avatarUrl,
    totalPoints: Number(row.totalPoints),
    gamesPlayed: gameCountMap.get(row.userId) ?? 0,
    readingsCompleted: readingCountMap.get(row.userId) ?? 0,
  }));

  return c.json({ success: true, data: leaderboard });
}

export { leaderboardRoutes };
