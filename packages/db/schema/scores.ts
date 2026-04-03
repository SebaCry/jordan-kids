import { pgTable, serial, varchar, integer, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { seasons } from "./seasons.js";

export const scores = pgTable(
  "scores",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    seasonId: integer("season_id")
      .references(() => seasons.id, { onDelete: "cascade" })
      .notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    activityKey: varchar("activity_key", { length: 100 }).notNull(),
    points: integer("points").default(0).notNull(),
    metadata: jsonb("metadata").default({}).notNull(),
    awardedBy: integer("awarded_by").references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_scores_user_season").on(table.userId, table.seasonId),
    index("idx_scores_leaderboard").on(table.seasonId, table.points),
  ]
);

export const scoresRelations = relations(scores, ({ one }) => ({
  user: one(users, {
    fields: [scores.userId],
    references: [users.id],
  }),
  season: one(seasons, {
    fields: [scores.seasonId],
    references: [seasons.id],
  }),
  awarder: one(users, {
    fields: [scores.awardedBy],
    references: [users.id],
    relationName: "awardedScores",
  }),
}));
