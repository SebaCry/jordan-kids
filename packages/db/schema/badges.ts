import { pgTable, serial, varchar, text, jsonb, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.js";
import { seasons } from "./seasons.js";

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  description: text("description"),
  iconUrl: text("icon_url"),
  criteria: jsonb("criteria"),
  tier: varchar("tier", { length: 20 }).default("bronze").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const badgesEarned = pgTable(
  "badges_earned",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    badgeId: integer("badge_id")
      .references(() => badges.id, { onDelete: "cascade" })
      .notNull(),
    seasonId: integer("season_id")
      .references(() => seasons.id, { onDelete: "cascade" })
      .notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("uq_user_badge_season").on(table.userId, table.badgeId, table.seasonId),
  ]
);

export const badgesRelations = relations(badges, ({ many }) => ({
  earned: many(badgesEarned),
}));

export const badgesEarnedRelations = relations(badgesEarned, ({ one }) => ({
  user: one(users, {
    fields: [badgesEarned.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [badgesEarned.badgeId],
    references: [badges.id],
  }),
  season: one(seasons, {
    fields: [badgesEarned.seasonId],
    references: [seasons.id],
  }),
}));
