"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, Bell } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionUser, UserRole } from "@/lib/auth";

interface HeaderProps {
  user: SessionUser;
  onMenuToggle: () => void;
}

const roleBadgeVariant: Record<UserRole, "default" | "secondary" | "accent" | "success"> = {
  admin: "secondary",
  leader: "default",
  parent: "success",
  child: "accent",
};

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  leader: "Lider",
  parent: "Padre",
  child: "Nino",
};

export function Header({ user, onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-light bg-white/80 px-4 backdrop-blur-md lg:px-6">
      {/* Left: Menu button (mobile) + greeting */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-[var(--radius-button)] p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Abrir menu de navegacion"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500">
            Bienvenido,{" "}
            <span className="font-bold text-gray-900">{user.name}</span>
          </p>
        </div>
      </div>

      {/* Right: Notifications + User info + Logout */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificaciones"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <div className="hidden md:flex md:flex-col">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name}
            </span>
            <Badge variant={roleBadgeVariant[user.role]} className="w-fit mt-0.5">
              {roleLabels[user.role]}
            </Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          loading={loggingOut}
          aria-label="Cerrar sesion"
          className="text-gray-400 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
