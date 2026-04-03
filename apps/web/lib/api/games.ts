import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db.js";
import { games, gameSessions, scores, seasons, users, badges, badgesEarned } from "@jordan-kids/db";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { PERMISSIONS } from "@jordan-kids/shared";
import type { GameAnswer } from "@jordan-kids/shared";
import {
  auth,
  requirePermission,
  requireRole,
  auditLogMiddleware,
  type AuthEnv,
} from "./middleware.js";

const createGameSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  gameType: z.enum(["trivia", "speed", "memory", "puzzle"]),
  config: z.record(z.unknown()).optional(),
  pointsPerCorrect: z.number().int().positive().optional(),
  maxPoints: z.number().int().positive().optional(),
});

const updateGameSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  gameType: z.enum(["trivia", "speed", "memory", "puzzle"]).optional(),
  config: z.record(z.unknown()).optional(),
  pointsPerCorrect: z.number().int().positive().optional(),
  maxPoints: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional(),
});

const submitAnswersSchema = z.object({
  seasonId: z.number().int().positive(),
  answers: z.array(
    z.object({
      questionIndex: z.number().int().min(0),
      selectedOption: z.number().int().min(0),
      isCorrect: z.boolean(),
      timeTaken: z.number().min(0),
    })
  ),
  durationSeconds: z.number().int().min(0),
});

const gamesRoutes = new Hono<AuthEnv>();

gamesRoutes.use("*", auth());

// GET /games
gamesRoutes.get("/", async (c) => {
  try {
    const result = await db
      .select()
      .from(games)
      .orderBy(games.name);

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error("List games error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// GET /games/:id
gamesRoutes.get("/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    if (isNaN(id)) {
      return c.json({ success: false, error: "Invalid game ID" }, 400);
    }

    const result = await db
      .select()
      .from(games)
      .where(eq(games.id, id))
      .limit(1);

    const game = result[0];
    if (!game) {
      return c.json({ success: false, error: "Game not found" }, 404);
    }

    return c.json({ success: true, data: game });
  } catch (err) {
    console.error("Get game error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

// POST /games - create game (admin)
gamesRoutes.post(
  "/",
  requireRole("admin"),
  auditLogMiddleware("create_game"),
  async (c) => {
    try {
      const body = await c.req.json();
      const parsed = createGameSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const [game] = await db
        .insert(games)
        .values({
          name: parsed.data.name,
          slug: parsed.data.slug,
          description: parsed.data.description ?? null,
          gameType: parsed.data.gameType,
          config: parsed.data.config ?? {},
          pointsPerCorrect: parsed.data.pointsPerCorrect ?? 1,
          maxPoints: parsed.data.maxPoints ?? null,
        })
        .returning();

      return c.json({ success: true, data: game }, 201);
    } catch (err) {
      console.error("Create game error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// PUT /games/:id - update game (admin)
gamesRoutes.put(
  "/:id",
  requireRole("admin"),
  auditLogMiddleware("update_game"),
  async (c) => {
    try {
      const id = parseInt(c.req.param("id"), 10);
      if (isNaN(id)) {
        return c.json({ success: false, error: "Invalid game ID" }, 400);
      }

      const body = await c.req.json();
      const parsed = updateGameSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const update: Record<string, unknown> = {};
      const d = parsed.data;
      if (d.name !== undefined) update.name = d.name;
      if (d.description !== undefined) update.description = d.description;
      if (d.gameType !== undefined) update.gameType = d.gameType;
      if (d.config !== undefined) update.config = d.config;
      if (d.pointsPerCorrect !== undefined) update.pointsPerCorrect = d.pointsPerCorrect;
      if (d.maxPoints !== undefined) update.maxPoints = d.maxPoints;
      if (d.isActive !== undefined) update.isActive = d.isActive;

      if (Object.keys(update).length === 0) {
        return c.json({ success: false, error: "No fields to update" }, 400);
      }

      const [updated] = await db
        .update(games)
        .set(update)
        .where(eq(games.id, id))
        .returning();

      if (!updated) {
        return c.json({ success: false, error: "Game not found" }, 404);
      }

      return c.json({ success: true, data: updated });
    } catch (err) {
      console.error("Update game error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// POST /games/:id/play - start a game session
gamesRoutes.post(
  "/:id/play",
  requirePermission(PERMISSIONS.PLAY_GAMES),
  async (c) => {
    try {
      const gameId = parseInt(c.req.param("id"), 10);
      if (isNaN(gameId)) {
        return c.json({ success: false, error: "Invalid game ID" }, 400);
      }

      const game = await db
        .select()
        .from(games)
        .where(eq(games.id, gameId))
        .limit(1);

      if (!game[0] || !game[0].isActive) {
        return c.json({ success: false, error: "Game not found or inactive" }, 404);
      }

      // Find the active season
      const activeSeason = await db
        .select()
        .from(seasons)
        .where(eq(seasons.isActive, true))
        .limit(1);

      if (!activeSeason[0]) {
        return c.json({ success: false, error: "No active season" }, 400);
      }

      const user = c.get("user");

      const [session] = await db
        .insert(gameSessions)
        .values({
          userId: user.id,
          gameId,
          seasonId: activeSeason[0].id,
          score: 0,
          answers: [],
        })
        .returning();

      return c.json({
        success: true,
        data: {
          sessionId: session!.id,
          game: game[0],
        },
      }, 201);
    } catch (err) {
      console.error("Play game error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// POST /games/:id/submit - submit answers
gamesRoutes.post(
  "/:id/submit",
  requirePermission(PERMISSIONS.PLAY_GAMES),
  auditLogMiddleware("submit_game"),
  async (c) => {
    try {
      const gameId = parseInt(c.req.param("id"), 10);
      if (isNaN(gameId)) {
        return c.json({ success: false, error: "Invalid game ID" }, 400);
      }

      const body = await c.req.json();
      const parsed = submitAnswersSchema.safeParse(body);
      if (!parsed.success) {
        return c.json(
          { success: false, error: "Validation error", details: parsed.error.flatten().fieldErrors },
          400
        );
      }

      const game = await db
        .select()
        .from(games)
        .where(eq(games.id, gameId))
        .limit(1);

      if (!game[0]) {
        return c.json({ success: false, error: "Game not found" }, 404);
      }

      const { seasonId, answers, durationSeconds } = parsed.data;
      const user = c.get("user");

      const correctCount = answers.filter((a: GameAnswer) => a.isCorrect).length;
      let totalScore = correctCount * game[0].pointsPerCorrect;
      if (game[0].maxPoints !== null && totalScore > game[0].maxPoints) {
        totalScore = game[0].maxPoints;
      }
      const maxScore = answers.length * game[0].pointsPerCorrect;

      // Create the game session record
      const [session] = await db
        .insert(gameSessions)
        .values({
          userId: user.id,
          gameId,
          seasonId,
          score: totalScore,
          maxScore,
          durationSeconds,
          answers,
          completedAt: new Date(),
        })
        .returning();

      // Award score points
      await db.insert(scores).values({
        userId: user.id,
        seasonId,
        category: "game",
        activityKey: `game_${game[0].slug}`,
        points: totalScore,
        metadata: {
          gameId,
          sessionId: session!.id,
          correctAnswers: correctCount,
          totalQuestions: answers.length,
        },
        awardedBy: user.id,
      });

      // Check for badge eligibility (Maestro de Trivia - 50 correct answers)
      const correctAnswersAgg = await db
        .select({
          totalCorrect: sql<number>`COALESCE(SUM((metadata->>'correctAnswers')::int), 0)`,
        })
        .from(scores)
        .where(
          and(
            eq(scores.userId, user.id),
            eq(scores.category, "game")
          )
        );

      const totalCorrectAnswers = correctAnswersAgg[0]?.totalCorrect ?? 0;

      if (totalCorrectAnswers >= 50) {
        const triviaBadge = await db
          .select()
          .from(badges)
          .where(eq(badges.slug, "maestro-de-trivia"))
          .limit(1);

        if (triviaBadge[0]) {
          await db
            .insert(badgesEarned)
            .values({
              userId: user.id,
              badgeId: triviaBadge[0].id,
              seasonId,
            })
            .onConflictDoNothing();
        }
      }

      return c.json({
        success: true,
        data: {
          sessionId: session!.id,
          score: totalScore,
          maxScore,
          correctAnswers: correctCount,
          totalQuestions: answers.length,
          durationSeconds,
        },
      });
    } catch (err) {
      console.error("Submit game error:", err);
      return c.json({ success: false, error: "Internal server error" }, 500);
    }
  }
);

// GET /games/:id/leaderboard - game-specific leaderboard
gamesRoutes.get("/:id/leaderboard", async (c) => {
  try {
    const gameId = parseInt(c.req.param("id"), 10);
    if (isNaN(gameId)) {
      return c.json({ success: false, error: "Invalid game ID" }, 400);
    }

    const result = await db
      .select({
        userId: gameSessions.userId,
        userName: users.name,
        avatarUrl: users.avatarUrl,
        totalScore: sql<number>`SUM(${gameSessions.score})`,
        gamesPlayed: count(gameSessions.id),
        bestScore: sql<number>`MAX(${gameSessions.score})`,
      })
      .from(gameSessions)
      .innerJoin(users, eq(gameSessions.userId, users.id))
      .where(eq(gameSessions.gameId, gameId))
      .groupBy(gameSessions.userId, users.name, users.avatarUrl)
      .orderBy(desc(sql`SUM(${gameSessions.score})`))
      .limit(50);

    const leaderboard = result.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      userName: row.userName,
      avatarUrl: row.avatarUrl,
      totalScore: Number(row.totalScore),
      gamesPlayed: Number(row.gamesPlayed),
      bestScore: Number(row.bestScore),
    }));

    return c.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error("Game leaderboard error:", err);
    return c.json({ success: false, error: "Internal server error" }, 500);
  }
});

export { gamesRoutes };
