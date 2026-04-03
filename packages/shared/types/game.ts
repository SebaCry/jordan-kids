export type GameType = "trivia" | "speed" | "memory" | "puzzle";

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  points: number;
  timeLimit: number;
}

export interface GameConfig {
  gameType: GameType;
  timeLimit?: number;
  questionsCount?: number;
  difficulty?: "easy" | "medium" | "hard";
  questions?: TriviaQuestion[];
}

export interface GameResult {
  sessionId: number;
  gameId: number;
  score: number;
  maxScore: number;
  durationSeconds: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface GameSessionData {
  gameId: number;
  seasonId: number;
  answers: GameAnswer[];
  durationSeconds: number;
}

export interface GameAnswer {
  questionIndex: number;
  selectedOption: number;
  isCorrect: boolean;
  timeTaken: number;
}
