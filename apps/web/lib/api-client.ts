const BASE_URL = "/api";

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Error de red" }));
    throw new Error(error.message || `Error ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: ApiOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ApiOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// ─── Typed API helpers ────────────────────────────────────────────
export interface Child {
  id: number;
  name: string;
  email: string;
  age?: number;
  grade?: string;
  avatarUrl?: string | null;
  totalPoints: number;
  badgeCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  avatarUrl?: string | null;
  totalPoints: number;
  badgeCount: number;
}

export interface Season {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Reading {
  id: number;
  title: string;
  bibleReference: string;
  content?: string;
  difficulty: "easy" | "medium" | "hard";
  pointsValue: number;
  status?: "pending" | "in_progress" | "completed";
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  gameType: string;
  pointsPerCorrect: number;
  isActive: boolean;
}

export interface Badge {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  earned?: boolean;
  earnedAt?: string;
}

export interface ScoreEntry {
  id: number;
  category: string;
  activityKey: string;
  points: number;
  createdAt: string;
}

export interface DashboardStats {
  totalChildren: number;
  activeThisWeek: number;
  pointsDistributed: number;
  gamesPlayed: number;
}

export interface ChildDetail extends Child {
  scores: ScoreEntry[];
  badges: Badge[];
  readings: (Reading & { status: string })[];
  gameSessions: {
    id: number;
    gameName: string;
    score: number;
    maxScore: number;
    completedAt: string;
  }[];
}
