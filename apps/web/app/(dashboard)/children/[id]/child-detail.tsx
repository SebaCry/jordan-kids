"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Award,
  BookOpen,
  Gamepad2,
  Plus,
  Minus,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { PointsButton } from "@/components/scores/points-button";
import { BadgeCard } from "@/components/badges/badge-card";
import type { ChildDetail as ChildDetailType } from "@/lib/api-client";
import { formatDate, formatPoints } from "@/lib/utils";

const ACTIVITIES = [
  { key: "traerBiblia", label: "Traer la Biblia", points: 2 },
  { key: "versiculoMemorizado", label: "Versiculo memorizado", points: 2 },
  { key: "participacion", label: "Participacion", points: 1 },
  { key: "busquedaRapida", label: "Busqueda rapida", points: 2 },
  { key: "traerAmigo", label: "Traer un amigo", points: 5 },
  { key: "responderPreguntas", label: "Responder preguntas", points: 1 },
  { key: "asistenciaPuntual", label: "Asistencia puntual", points: 1 },
  { key: "realizarOracion", label: "Realizar una oracion", points: 1 },
];

export function ChildDetail({
  childId,
  canManageScores,
}: {
  childId: number;
  canManageScores: boolean;
}) {
  const [child, setChild] = React.useState<ChildDetailType | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const fetchChild = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/children/${childId}`);
      if (!res.ok) throw new Error("No se pudo cargar el nino");
      const data = await res.json();
      setChild(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [childId]);

  React.useEffect(() => {
    fetchChild();
  }, [fetchChild]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{error || "Nino no encontrado"}</p>
        <Link href="/children">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>
    );
  }

  const completedReadings = child.readings?.filter(
    (r) => r.status === "completed"
  ).length ?? 0;
  const totalReadings = child.readings?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/children"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a ninos
      </Link>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400" />
          <CardContent className="relative -mt-12 px-6 pb-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <Avatar
                name={child.name}
                src={child.avatarUrl}
                size="xl"
                className="border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-extrabold">{child.name}</h1>
                <p className="text-sm text-gray-500">{child.email}</p>
                {child.age && (
                  <Badge variant="outline" className="mt-1">
                    {child.age} anos
                  </Badge>
                )}
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <p className="text-2xl font-extrabold text-accent-500">
                    {formatPoints(child.totalPoints)}
                  </p>
                  <p className="text-xs text-gray-500">Puntos</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-secondary-500">
                    {child.badgeCount}
                  </p>
                  <p className="text-xs text-gray-500">Badges</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="puntos">
        <TabsList className="flex-wrap">
          <TabsTrigger value="puntos">
            <Star className="mr-1.5 h-4 w-4" />
            Puntos
          </TabsTrigger>
          <TabsTrigger value="lecturas">
            <BookOpen className="mr-1.5 h-4 w-4" />
            Lecturas
          </TabsTrigger>
          <TabsTrigger value="juegos">
            <Gamepad2 className="mr-1.5 h-4 w-4" />
            Juegos
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Award className="mr-1.5 h-4 w-4" />
            Badges
          </TabsTrigger>
        </TabsList>

        {/* Points tab */}
        <TabsContent value="puntos">
          <div className="space-y-4">
            {canManageScores && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Asignar puntos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {ACTIVITIES.map((activity) => (
                      <div
                        key={activity.key}
                        className="flex items-center justify-between rounded-[var(--radius-button)] border-2 border-border-light p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold">{activity.label}</p>
                          <p className="text-xs text-gray-400">
                            +{activity.points} pts
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <PointsButton
                            childId={childId}
                            activityKey={activity.key}
                            action="remove"
                            onSuccess={fetchChild}
                          />
                          <PointsButton
                            childId={childId}
                            activityKey={activity.key}
                            action="add"
                            onSuccess={fetchChild}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Score history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Historial de puntos</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actividad</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Puntos</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(!child.scores || child.scores.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-8 text-center text-gray-400">
                          Sin puntos registrados aun
                        </TableCell>
                      </TableRow>
                    ) : (
                      child.scores.map((score) => (
                        <TableRow key={score.id}>
                          <TableCell className="font-medium">
                            {score.activityKey}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{score.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-accent-600">
                              +{score.points}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-500">
                            {formatDate(score.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Readings tab */}
        <TabsContent value="lecturas">
          <div className="space-y-4">
            <Progress
              value={completedReadings}
              max={totalReadings || 1}
              showLabel
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(!child.readings || child.readings.length === 0) ? (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center gap-3 py-12">
                    <BookOpen className="h-10 w-10 text-gray-300" />
                    <p className="text-gray-400">Sin lecturas asignadas</p>
                  </CardContent>
                </Card>
              ) : (
                child.readings.map((reading) => (
                  <Card key={reading.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{reading.title}</CardTitle>
                        <Badge
                          variant={
                            reading.status === "completed"
                              ? "success"
                              : reading.status === "in_progress"
                              ? "accent"
                              : "outline"
                          }
                        >
                          {reading.status === "completed"
                            ? "Completada"
                            : reading.status === "in_progress"
                            ? "En progreso"
                            : "Pendiente"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
                        {reading.bibleReference}
                      </p>
                      <p className="mt-2 text-xs text-accent-600 font-semibold">
                        +{reading.pointsValue} puntos
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* Games tab */}
        <TabsContent value="juegos">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Juego</TableHead>
                    <TableHead>Puntuacion</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(!child.gameSessions || child.gameSessions.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-gray-400">
                        Sin sesiones de juego
                      </TableCell>
                    </TableRow>
                  ) : (
                    child.gameSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">
                          {session.gameName}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold">
                            {session.score}
                            {session.maxScore ? `/${session.maxScore}` : ""}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-500">
                          {formatDate(session.completedAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Badges tab */}
        <TabsContent value="badges">
          {(!child.badges || child.badges.length === 0) ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12">
                <Award className="h-10 w-10 text-gray-300" />
                <p className="text-gray-400">Sin badges disponibles</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {child.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
