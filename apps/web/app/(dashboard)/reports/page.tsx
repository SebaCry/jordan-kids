"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Zap,
  Star,
  Download,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { DashboardStats } from "@/lib/api-client";

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

interface ActivityStat {
  key: string;
  count: number;
}

interface AttendanceEntry {
  date: string;
  count: number;
  total: number;
}

export default function ReportsPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [activityStats, setActivityStats] = React.useState<ActivityStat[]>([]);
  const [attendance, setAttendance] = React.useState<AttendanceEntry[]>([]);

  React.useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => null);

    fetch("/api/reports/activities")
      .then((r) => (r.ok ? r.json() : { activities: [] }))
      .then((data) => setActivityStats(data.activities ?? []))
      .catch(() => null);

    fetch("/api/reports/attendance")
      .then((r) => (r.ok ? r.json() : { attendance: [] }))
      .then((data) => setAttendance(data.attendance ?? []))
      .catch(() => null);
  }, []);

  const displayStats = stats ?? {
    totalChildren: 0,
    activeThisWeek: 0,
    pointsDistributed: 0,
    gamesPlayed: 0,
  };

  const handleExport = () => {
    // Build CSV
    const headers = ["Fecha", "Asistencia", "Total"];
    const rows = attendance.map((a) => [a.date, a.count, a.total]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-asistencia-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxActivityCount = Math.max(1, ...activityStats.map((a) => a.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary-500" />
            Reportes
          </h1>
          <p className="text-sm text-gray-500">
            Metricas y estadisticas del club
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total ninos",
            value: displayStats.totalChildren,
            icon: Users,
            color: "text-primary-500",
            bg: "bg-primary-50",
          },
          {
            label: "Activos esta semana",
            value: displayStats.activeThisWeek,
            icon: Zap,
            color: "text-accent-500",
            bg: "bg-accent-50",
          },
          {
            label: "Puntos otorgados",
            value: displayStats.pointsDistributed,
            icon: Star,
            color: "text-success-500",
            bg: "bg-success-50",
          },
          {
            label: "Juegos jugados",
            value: displayStats.gamesPlayed,
            icon: TrendingUp,
            color: "text-secondary-500",
            bg: "bg-secondary-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Activity chart */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades mas populares</CardTitle>
          <CardDescription>
            Cuantas veces se ha registrado cada actividad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ACTIVITIES.map((activity) => {
              const stat = activityStats.find((a) => a.key === activity.key);
              const count = stat?.count ?? 0;
              const pct = (count / maxActivityCount) * 100;

              return (
                <div key={activity.key} className="flex items-center gap-3">
                  <span className="w-40 text-sm font-medium text-gray-600 truncate">
                    {activity.label}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm font-bold text-gray-700">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-500" />
            Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Asistencia</TableHead>
                <TableHead>Total ninos</TableHead>
                <TableHead>Porcentaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-gray-400">
                    Sin datos de asistencia
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((entry) => {
                  const pct = entry.total > 0 ? Math.round((entry.count / entry.total) * 100) : 0;
                  return (
                    <TableRow key={entry.date}>
                      <TableCell className="font-medium">{entry.date}</TableCell>
                      <TableCell className="font-bold">{entry.count}</TableCell>
                      <TableCell>{entry.total}</TableCell>
                      <TableCell>
                        <Badge variant={pct >= 80 ? "success" : pct >= 50 ? "accent" : "destructive"}>
                          {pct}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
