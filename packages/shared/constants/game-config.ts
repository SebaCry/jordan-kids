import type { GameConfig } from "../types/game.js";
import type { BadgeTier } from "../types/score.js";

export const DEFAULT_TRIVIA_CONFIG: GameConfig = {
  gameType: "trivia",
  timeLimit: 30,
  questionsCount: 10,
  difficulty: "easy",
};

export const DEFAULT_SPEED_CONFIG: GameConfig = {
  gameType: "speed",
  timeLimit: 60,
  questionsCount: 20,
  difficulty: "medium",
};

export const DEFAULT_MEMORY_CONFIG: GameConfig = {
  gameType: "memory",
  timeLimit: 120,
  questionsCount: 12,
  difficulty: "easy",
};

export const DEFAULT_PUZZLE_CONFIG: GameConfig = {
  gameType: "puzzle",
  timeLimit: 180,
  questionsCount: 5,
  difficulty: "hard",
};

export interface BadgeTierConfig {
  tier: BadgeTier;
  label: string;
  color: string;
  minPoints: number;
}

export const BADGE_TIERS: BadgeTierConfig[] = [
  { tier: "bronze", label: "Bronce", color: "#CD7F32", minPoints: 0 },
  { tier: "silver", label: "Plata", color: "#C0C0C0", minPoints: 50 },
  { tier: "gold", label: "Oro", color: "#FFD700", minPoints: 150 },
  { tier: "platinum", label: "Platino", color: "#E5E4E2", minPoints: 500 },
];
