"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Reading } from "@/lib/api-client";

const difficultyConfig = {
  easy: { label: "Facil", variant: "success" as const },
  medium: { label: "Media", variant: "accent" as const },
  hard: { label: "Dificil", variant: "destructive" as const },
};

export function ReadingDetail({ readingId }: { readingId: number }) {
  const [reading, setReading] = React.useState<Reading | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [completing, setCompleting] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetch(`/api/readings/${readingId}`)
      .then((r) => {
        if (!r.ok) throw new Error("No se pudo cargar la lectura");
        return r.json();
      })
      .then((data) => {
        setReading(data);
        setCompleted(data.status === "completed");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [readingId]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await fetch(`/api/readings/${readingId}/complete`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Error al completar lectura");
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || "Lectura no encontrada"}</p>
        <Link href="/readings">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>
    );
  }

  const diff = difficultyConfig[reading.difficulty] || difficultyConfig.easy;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/readings"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a lecturas
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{reading.title}</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge variant={diff.variant}>{diff.label}</Badge>
                  <span className="flex items-center gap-1 text-sm font-semibold text-accent-600">
                    <Star className="h-4 w-4" />
                    +{reading.pointsValue} puntos
                  </span>
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-primary-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-[var(--radius-fun)] bg-primary-50 p-4">
              <p className="text-sm font-bold text-primary-700">
                Referencia biblica
              </p>
              <p className="mt-1 text-lg font-semibold text-primary-900">
                {reading.bibleReference}
              </p>
            </div>

            {reading.content && (
              <div className="prose prose-sm max-w-none">
                <p className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {reading.content}
                </p>
              </div>
            )}

            {completed ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 rounded-[var(--radius-fun)] bg-success-50 border border-success-200 p-4"
              >
                <CheckCircle2 className="h-6 w-6 text-success-500" />
                <div>
                  <p className="font-bold text-success-700">Lectura completada!</p>
                  <p className="text-sm text-success-600">
                    Has ganado {reading.pointsValue} puntos
                  </p>
                </div>
              </motion.div>
            ) : (
              <Button
                onClick={handleComplete}
                loading={completing}
                size="lg"
                variant="success"
                className="w-full"
              >
                <CheckCircle2 className="h-5 w-5" />
                Marcar como completada
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
