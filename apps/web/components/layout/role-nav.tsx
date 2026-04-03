import {
  Gamepad2,
  BookOpen,
  Trophy,
  User,
  Users,
  Star,
  BarChart3,
  Calendar,
  Award,
  Settings,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import type { UserRole } from "@/lib/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const childNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Juegos", href: "/games", icon: Gamepad2 },
  { label: "Lecturas", href: "/readings", icon: BookOpen },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Mi Perfil", href: "/settings", icon: User },
];

const parentNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Mis Hijos", href: "/children", icon: Users },
  { label: "Progreso", href: "/reports", icon: TrendingUp },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Mi Perfil", href: "/settings", icon: User },
];

const leaderNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Ninos", href: "/children", icon: Users },
  { label: "Puntos", href: "/scores", icon: Star },
  { label: "Lecturas", href: "/readings", icon: BookOpen },
  { label: "Reportes", href: "/reports", icon: BarChart3 },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Configuracion", href: "/settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Ninos", href: "/children", icon: Users },
  { label: "Puntos", href: "/scores", icon: Star },
  { label: "Lecturas", href: "/readings", icon: BookOpen },
  { label: "Juegos", href: "/games", icon: Gamepad2 },
  { label: "Badges", href: "/children", icon: Award },
  { label: "Temporadas", href: "/seasons", icon: Calendar },
  { label: "Reportes", href: "/reports", icon: BarChart3 },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Configuracion", href: "/settings", icon: Settings },
];

export function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "child":
      return childNav;
    case "parent":
      return parentNav;
    case "leader":
      return leaderNav;
    case "admin":
      return adminNav;
    default:
      return childNav;
  }
}
