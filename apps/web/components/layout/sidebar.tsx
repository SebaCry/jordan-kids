"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavItems, type NavItem } from "./role-nav";
import type { UserRole } from "@/lib/auth";
import { X, Sparkles } from "lucide-react";

interface SidebarProps {
  role: UserRole;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(role);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-border-light shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Navegacion principal"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border-light px-4">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] bg-gradient-to-br from-primary-500 to-secondary-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              JordanList
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            aria-label="Cerrar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Menu principal">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href + item.label}
              item={item}
              isActive={
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              }
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border-light p-4">
          <p className="text-xs text-gray-400 text-center">
            JordanList v2.0
          </p>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-button)] px-3 py-2.5 text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-primary-50 text-primary-700 shadow-sm"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          isActive ? "text-primary-500" : "text-gray-400"
        )}
      />
      <span>{item.label}</span>
      {isActive && (
        <div className="ml-auto h-2 w-2 rounded-full bg-primary-500" />
      )}
    </Link>
  );
}
