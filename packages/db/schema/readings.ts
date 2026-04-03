import { pgTable, serial, varchar, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { seasons } from "./seasons.js";

export const readings = pgTable("readings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  bibleReference: varchar("bible_reference", { length: 100 }).notNull(),
  content: text("content"),
  difficulty: varchar("difficulty", { length: 20 }).default("easy").notNull(),
  pointsValue: integer("points_value").default(5).notNull(),
  seasonId: integer("season_id")
    .references(() => seasons.id, { onDelete: "cascade" })
    .notNull(),
  createdBy: integer("created_by")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const readingProgress = pgTable(
  "reading_progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    readingId: integer("reading_id")
      .references(() => readings.id, { onDelete: "cascade" })
      .notNull(),
    status: varchar("status", { length: 20 }).default("pending").notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_user_reading").on(table.userId, table.readingId),
  ]
);

export const readingsRelations = relations(readings, ({ one, many }) => ({
  season: one(seasons, {
    fields: [readings.seasonId],
    references: [seasons.id],
  }),
  creator: one(users, {
    fields: [readings.createdBy],
    references: [users.id],
  }),
  progress: many(readingProgress),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  user: one(users, {
    fields: [readingProgress.userId],
    references: [users.id],
  }),
  reading: one(readings, {
    fields: [readingProgress.readingId],
    references: [readings.id],
  }),
}));
