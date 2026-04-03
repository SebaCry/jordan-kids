"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gamepad2,
  BookOpen,
  Trophy,
  Star,
  Users,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/auth";
import type { DashboardStats } from "@/lib/api-client";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export function DashboardContent({ user }: { user: SessionUser }) {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);

  React.useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setStats(data))
      .catch(() => null);
  }, []);

  if (user.role === "child") return <ChildDashboard name={user.name} />;
  if (user.role === "parent") return <ParentDashboard name={user.name} />;
  return <LeaderDashboard name={user.name} role={user.role} stats={stats} />;
}

function ChildDashboard({ name }: { name: string }) {
  const [myStats, setMyStats] = React.useState({ points: 0, badges: 0, readings: 0 });

  React.useEffect(() => {
    fetch("/api/me/stats")
      .then((r) => (r.ok ? r.json() : { points: 0, badges: 0, readings: 0 }))
      .then(setMyStats)
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-[var(--radius-card)] bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-400 p-8 text-white shadow-fun">
          <h1 className="text-3xl font-extrabold">
            Hola {name}! 🎉
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Que bueno verte de nuevo. Sigue aprendiendo y ganando puntos!
          </p>
          <Link href="/games">
            <Button variant="accent" size="lg" className="mt-4 bg-white text-primary-700 hover:bg-white/90">
              <Gamepad2 className="h-5 w-5" />
              Jugar ahora
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Mis Puntos",
            value: myStats.points,
            icon: Star,
            color: "text-accent-500",
            bg: "bg-accent-50",
          },
          {
            label: "Mis Badges",
            value: myStats.badges,
            icon: Award,
            color: "text-secondary-500",
            bg: "bg-secondary-50",
          },
          {
            label: "Lecturas",
            value: myStats.readings,
            icon: BookOpen,
            color: "text-success-500",
            bg: "bg-success-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/games" className="block">
          <Card className="group cursor-pointer border-2 border-transparent hover:border-primary-300 transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 group-hover:bg-primary-200 transition-colors">
                <Gamepad2 className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Juegos</h3>
                <p className="text-sm text-gray-500">Juega trivia, memoria y mas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/readings" className="block">
          <Card className="group cursor-pointer border-2 border-transparent hover:border-success-300 transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-100 group-hover:bg-success-200 transition-colors">
                <BookOpen className="h-7 w-7 text-success-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Lecturas</h3>
                <p className="text-sm text-gray-500">Lee y aprende la Biblia</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function ParentDashboard({ name }: { name: string }) {
  const [children, setChildren] = React.useState<
    { id: number; name: string; totalPoints: number; badgeCount: number }[]
  >([]);

  React.useEffect(() => {
    fetch("/api/me/children")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setChildren(data.children ?? data ?? []))
      .catch(() => null);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-gray-900">
          Hola {name}!
        </h1>
        <p className="text-gray-500">
          Aqui puedes ver el progreso de tus hijos.
        </p>
      </motion.div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Users className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500">
              No tienes hijos asignados todavia.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child, i) => (
            <motion.div
              key={child.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Link href={`/children/${child.id}`}>
                <Card className="cursor-pointer border-2 border-transparent hover:border-primary-300 transition-all">
                  <CardHeader>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-accent-500" />
                        <span className="font-bold">{child.totalPoints}</span>
                        <span className="text-sm text-gray-500">puntos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-secondary-500" />
                        <span className="font-bold">{child.badgeCount}</span>
                        <span className="text-sm text-gray-500">badges</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeaderDashboard({
  name,
  role,
  stats,
}: {
  name: string;
  role: string;
  stats: DashboardStats | null;
}) {
  const displayStats = stats ?? {
    totalChildren: 0,
    activeThisWeek: 0,
    pointsDistributed: 0,
    gamesPlayed: 0,
  };

  const statCards = [
    {
      label: "Ninos activos",
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
      icon: TrendingUp,
      color: "text-success-500",
      bg: "bg-success-50",
    },
    {
      label: "Juegos jugados",
      value: displayStats.gamesPlayed,
      icon: Gamepad2,
      color: "text-secondary-500",
      bg: "bg-secondary-50",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-gray-900">
          Bienvenido, {name}
        </h1>
        <p className="text-gray-500">
          Panel de {role === "admin" ? "administrador" : "lider"} - resumen general
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}
                >
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/children" className="block">
          <Card className="group cursor-pointer border-2 border-transparent hover:border-primary-300 transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <Users className="h-8 w-8 text-primary-500" />
              <div>
                <h3 className="font-bold">Gestionar Ninos</h3>
                <p className="text-sm text-gray-500">Ver, agregar y editar ninos</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/scores" className="block">
          <Card className="group cursor-pointer border-2 border-transparent hover:border-accent-300 transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <Star className="h-8 w-8 text-accent-500" />
              <div>
                <h3 className="font-bold">Asignar Puntos</h3>
                <p className="text-sm text-gray-500">Dar puntos por actividades</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/leaderboard" className="block">
          <Card className="group cursor-pointer border-2 border-transparent hover:border-secondary-300 transition-all">
            <CardContent className="flex items-center gap-4 p-6">
              <Trophy className="h-8 w-8 text-secondary-500" />
              <div>
                <h3 className="font-bold">Leaderboard</h3>
                <p className="text-sm text-gray-500">Ver clasificacion en vivo</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
