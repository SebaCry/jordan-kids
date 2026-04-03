export type ScoreCategory = "attendance" | "reading" | "game" | "activity";

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum";

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  avatarUrl: string | null;
  totalPoints: number;
  gamesPlayed: number;
  readingsCompleted: number;
}

export interface ScoreSummary {
  userId: number;
  seasonId: number;
  totalPoints: number;
  byCategory: {
    category: ScoreCategory;
    points: number;
    count: number;
  }[];
  badgesEarned: number;
  rank: number;
}
