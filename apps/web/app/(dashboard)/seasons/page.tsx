"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Play, Square, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Season } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function SeasonsPage() {
  const [seasons, setSeasons] = React.useState<Season[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreate, setShowCreate] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", startDate: "", endDate: "" });
  const [formLoading, setFormLoading] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  const fetchSeasons = React.useCallback(() => {
    fetch("/api/seasons")
      .then((r) => (r.ok ? r.json() : { seasons: [] }))
      .then((data) => setSeasons(data.seasons ?? data ?? []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al crear temporada");
      }
      setShowCreate(false);
      setForm({ name: "", startDate: "", endDate: "" });
      fetchSeasons();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggle = async (seasonId: number, action: "activate" | "close") => {
    try {
      await fetch(`/api/seasons/${seasonId}/${action}`, { method: "POST" });
      fetchSeasons();
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary-500" />
            Temporadas
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona las temporadas del club
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" />
          Nueva Temporada
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-32">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-gray-400">
                    No hay temporadas creadas
                  </TableCell>
                </TableRow>
              ) : (
                seasons.map((season, i) => (
                  <motion.tr
                    key={season.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border-light transition-colors hover:bg-cream-dark"
                  >
                    <TableCell className="font-semibold">
                      {season.name}
                    </TableCell>
                    <TableCell>{formatDate(season.startDate)}</TableCell>
                    <TableCell>{formatDate(season.endDate)}</TableCell>
                    <TableCell>
                      <Badge variant={season.isActive ? "success" : "outline"}>
                        {season.isActive ? "Activa" : "Cerrada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {season.isActive ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(season.id, "close")}
                        >
                          <Square className="h-3 w-3" />
                          Cerrar
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleToggle(season.id, "activate")}
                        >
                          <Play className="h-3 w-3" />
                          Activar
                        </Button>
                      )}
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear nueva temporada</DialogTitle>
            <DialogDescription>
              Define el nombre y las fechas de la temporada.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            {formError && (
              <div className="rounded-[var(--radius-button)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                {formError}
              </div>
            )}
            <Input
              label="Nombre"
              placeholder="Ej: Temporada Enero 2026"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Fecha de inicio"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              required
            />
            <Input
              label="Fecha de fin"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={formLoading}>
                <Plus className="h-4 w-4" />
                Crear
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
