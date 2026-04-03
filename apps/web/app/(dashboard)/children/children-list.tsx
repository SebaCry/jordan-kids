"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, UserPlus, Star, Award, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Child {
  id: number;
  name: string;
  email: string;
  age?: number;
  totalPoints: number;
  badgeCount: number;
  avatarUrl?: string | null;
}

interface ChildrenListProps {
  children: Child[];
  canManage: boolean;
}

export function ChildrenList({ children: initialChildren, canManage }: ChildrenListProps) {
  const [children, setChildren] = React.useState(initialChildren);
  const [search, setSearch] = React.useState("");
  const [showAdd, setShowAdd] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", age: "" });
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const filtered = children.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: formData.age ? parseInt(formData.age) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al crear nino");
      }

      const newChild = await res.json();
      setChildren((prev) => [...prev, { ...newChild, totalPoints: 0, badgeCount: 0 }]);
      setShowAdd(false);
      setFormData({ name: "", email: "", age: "" });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Ninos</h1>
          <p className="text-sm text-gray-500">{children.length} ninos registrados</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowAdd(true)}>
            <UserPlus className="h-4 w-4" />
            Agregar Nino
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
          aria-label="Buscar ninos"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Edad</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead className="hidden md:table-cell">Badges</TableHead>
                <TableHead className="w-10">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-gray-400">
                    {search ? "No se encontraron ninos con ese filtro" : "No hay ninos registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((child, i) => (
                  <motion.tr
                    key={child.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border-light transition-colors hover:bg-cream-dark"
                  >
                    <TableCell>
                      <Link
                        href={`/children/${child.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={child.name} src={child.avatarUrl} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-900">{child.name}</p>
                          <p className="text-xs text-gray-400">{child.email}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {child.age ? (
                        <Badge variant="outline">{child.age} anos</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-accent-500" />
                        <span className="font-bold">{child.totalPoints}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-secondary-500" />
                        <span className="font-semibold">{child.badgeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/children/${child.id}`} aria-label={`Ver perfil de ${child.name}`}>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Child Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar nuevo nino</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nino para registrarlo en el sistema.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="mt-4 space-y-4">
            {formError && (
              <div className="rounded-[var(--radius-button)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                {formError}
              </div>
            )}
            <Input
              label="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Correo electronico"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
            <Input
              label="Edad"
              type="number"
              min="3"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData((p) => ({ ...p, age: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={formLoading}>
                <UserPlus className="h-4 w-4" />
                Agregar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
