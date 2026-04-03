"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { GameWrapper } from "@/components/games/game-wrapper";
import { TriviaGame } from "@/components/games/trivia-game";
import { SpeedSearch } from "@/components/games/speed-search";
import { MemoryGame } from "@/components/games/memory-game";

const gameComponents: Record<string, React.ComponentType> = {
  trivia: TriviaGame,
  "speed-search": SpeedSearch,
  memory: MemoryGame,
};

export default function GamePlayPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const GameComponent = gameComponents[slug];

  if (!GameComponent) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-gray-400">Juego no encontrado</p>
        <p className="text-gray-400">El juego &ldquo;{slug}&rdquo; no existe.</p>
      </div>
    );
  }

  return (
    <GameWrapper>
      <GameComponent />
    </GameWrapper>
  );
}
