"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Brain, Search, Grid3X3, Play, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const gameIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  trivia: Brain,
  speed: Search,
  memory: Grid3X3,
};

const gameColors: Record<string, { border: string; bg: string; text: string }> = {
  trivia: { border: "border-primary-300", bg: "bg-primary-100", text: "text-primary-600" },
  speed: { border: "border-accent-300", bg: "bg-accent-100", text: "text-accent-600" },
  memory: { border: "border-secondary-300", bg: "bg-secondary-100", text: "text-secondary-600" },
};

interface Game {
  id: number;
  name: string;
  slug: string;
  description?: string;
  gameType: string;
  pointsPerCorrect: number;
  isActive: boolean;
}

export function GamesGrid({ games }: { games: Game[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Juegos</h1>
        <p className="text-sm text-gray-500">
          Elige un juego y diviertete mientras aprendes!
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.filter((g) => g.isActive).map((game, i) => {
          const Icon = gameIcons[game.gameType] || Gamepad2;
          const colors = gameColors[game.gameType] || gameColors.trivia;

          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/games/${game.slug}/play`}>
                <Card className={`group cursor-pointer border-2 ${colors.border} hover:shadow-card-hover transition-all duration-300`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-7 w-7 ${colors.text}`} />
                      </div>
                      <Badge variant="accent" className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        +{game.pointsPerCorrect} pts
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-xl">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group-hover:shadow-button" size="lg">
                      <Play className="h-5 w-5" />
                      Jugar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {games.filter((g) => g.isActive).length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Gamepad2 className="h-16 w-16 text-gray-300" />
            <p className="text-lg font-semibold text-gray-400">
              No hay juegos disponibles ahora
            </p>
            <p className="text-sm text-gray-400">
              Vuelve pronto, estamos preparando nuevos juegos!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
