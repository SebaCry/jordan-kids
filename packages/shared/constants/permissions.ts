export const PERMISSIONS = {
  MANAGE_USERS: "manage_users",
  MANAGE_CHILDREN: "manage_children",
  MANAGE_SCORES: "manage_scores",
  VIEW_SCORES: "view_scores",
  PLAY_GAMES: "play_games",
  MANAGE_GAMES: "manage_games",
  MANAGE_READINGS: "manage_readings",
  VIEW_READINGS: "view_readings",
  MANAGE_SEASONS: "manage_seasons",
  VIEW_REPORTS: "view_reports",
  MANAGE_BADGES: "manage_badges",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLES = {
  ADMIN: "admin",
  LEADER: "leader",
  PARENT: "parent",
  CHILD: "child",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
