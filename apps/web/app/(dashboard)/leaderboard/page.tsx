"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Star, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { useRealtimeScores } from "@/hooks/use-realtime-scores";
import type { LeaderboardEntry, Season } from "@/lib/api-client";

const podiumColors = [
  "from-yellow-400 to-amber-500",
  "from-gray-300 to-gray-400",
  "from-amber-600 to-amber-700",
];

const podiumIcons = [Crown, Medal, Medal];

export default function LeaderboardPage() {
  const [seasons, setSeasons] = React.useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = React.useState("");
  const { entries, isConnected, refresh } = useRealtimeScores(selectedSeason);

  React.useEffect(() => {
    fetch("/api/seasons")
      .then((r) => (r.ok ? r.json() : { seasons: [] }))
      .then((data) => {
        const list = data.seasons ?? data ?? [];
        setSeasons(list);
        const active = list.find((s: Season) => s.isActive);
        if (active) setSelectedSeason(String(active.id));
        else if (list.length > 0) setSelectedSeason(String(list[0].id));
      })
      .catch(() => null);
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  // Reorder for podium: [2nd, 1st, 3rd]
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Trophy className="h-7 w-7 text-accent-500" />
            Leaderboard
          </h1>
          <p className="text-sm text-gray-500">
            Clasificacion en tiempo real
            {isConnected && (
              <span className="ml-2 inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-xs text-success-600">En vivo</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            options={seasons.map((s) => ({ value: String(s.id), label: s.name }))}
            value={selectedSeason}
            onChange={setSelectedSeason}
            placeholder="Selecciona temporada"
            aria-label="Seleccionar temporada"
          />
          <Button variant="outline" size="icon" onClick={refresh} aria-label="Actualizar">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-400 p-6 pb-0">
            <div className="flex items-end justify-center gap-4 sm:gap-8">
              {podiumOrder.map((entry, displayIdx) => {
                if (!entry) return null;
                const actualRank = entry.rank;
                const heights = ["h-28", "h-36", "h-24"];
                const PodiumIcon = podiumIcons[actualRank - 1] || Medal;

                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: displayIdx * 0.15, duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-2">
                      {actualRank === 1 && (
                        <Crown className="absolute -top-5 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-300 drop-shadow-md" />
                      )}
                      <Avatar
                        name={entry.name}
                        src={entry.avatarUrl}
                        size={actualRank === 1 ? "xl" : "lg"}
                        className="border-3 border-white shadow-lg"
                      />
                    </div>
                    <p className="text-sm font-bold text-white truncate max-w-[100px]">
                      {entry.name}
                    </p>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {entry.totalPoints}
                    </p>
                    <div
                      className={`mt-2 w-20 sm:w-28 ${heights[displayIdx]} rounded-t-xl bg-gradient-to-t ${podiumColors[actualRank - 1] || podiumColors[2]} flex items-start justify-center pt-3`}
                    >
                      <span className="text-2xl font-extrabold text-white/90">
                        #{actualRank}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Full table */}
      <LeaderboardTable entries={entries} />

      {entries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <Trophy className="h-16 w-16 text-gray-300" />
            <p className="text-lg font-semibold text-gray-400">
              Sin datos de clasificacion
            </p>
            <p className="text-sm text-gray-400">
              Selecciona una temporada o espera a que se otorguen puntos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
