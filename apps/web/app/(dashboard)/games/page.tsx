import { GamesGrid } from "./games-grid";

export default async function GamesPage() {
  let games: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
    gameType: string;
    pointsPerCorrect: number;
    isActive: boolean;
  }> = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/games`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      games = data.games ?? data ?? [];
    }
  } catch {
    // Default games for demo
    games = [
      {
        id: 1,
        name: "Trivia Biblica",
        slug: "trivia",
        description: "Responde preguntas sobre la Biblia y gana puntos!",
        gameType: "trivia",
        pointsPerCorrect: 2,
        isActive: true,
      },
      {
        id: 2,
        name: "Busqueda Veloz",
        slug: "speed-search",
        description: "Encuentra versiculos de la Biblia lo mas rapido posible!",
        gameType: "speed",
        pointsPerCorrect: 3,
        isActive: true,
      },
      {
        id: 3,
        name: "Memorama Biblico",
        slug: "memory",
        description: "Encuentra los pares de versiculos y referencias!",
        gameType: "memory",
        pointsPerCorrect: 1,
        isActive: true,
      },
    ];
  }

  return <GamesGrid games={games} />;
}
