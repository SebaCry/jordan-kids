"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReadingCard } from "@/components/readings/reading-card";
import { ProgressBar } from "@/components/readings/progress-bar";

interface Reading {
  id: number;
  title: string;
  bibleReference: string;
  difficulty: "easy" | "medium" | "hard";
  pointsValue: number;
  status?: "pending" | "in_progress" | "completed";
}

export function ReadingsGrid({ readings }: { readings: Reading[] }) {
  const [filter, setFilter] = React.useState<string>("all");

  const filtered = readings.filter((r) => {
    if (filter === "all") return true;
    return r.difficulty === filter;
  });

  const completed = readings.filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Lecturas</h1>
          <p className="text-sm text-gray-500">
            Lee pasajes biblicos y gana puntos
          </p>
        </div>
      </div>

      {readings.length > 0 && (
        <ProgressBar completed={completed} total={readings.length} />
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" aria-hidden="true" />
        <span className="text-sm font-semibold text-gray-500">Filtrar:</span>
        {["all", "easy", "medium", "hard"].map((d) => (
          <Button
            key={d}
            variant={filter === d ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(d)}
          >
            {d === "all" ? "Todas" : d === "easy" ? "Facil" : d === "medium" ? "Media" : "Dificil"}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16">
            <BookOpen className="h-16 w-16 text-gray-300" />
            <p className="text-lg font-semibold text-gray-400">
              No hay lecturas disponibles
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((reading, i) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/readings/${reading.id}`}>
                <ReadingCard reading={reading} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
