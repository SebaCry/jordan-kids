"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Star, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityPicker } from "@/components/scores/activity-picker";
import type { Child } from "@/lib/api-client";

export default function ScoresPage() {
  const [children, setChildren] = React.useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = React.useState("");
  const [quickMode, setQuickMode] = React.useState(false);
  const [selectedChildren, setSelectedChildren] = React.useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = React.useState(0);

  React.useEffect(() => {
    fetch("/api/children")
      .then((r) => (r.ok ? r.json() : { children: [] }))
      .then((data) => {
        const list = data.children ?? data ?? [];
        setChildren(list);
      })
      .catch(() => null);
  }, []);

  const handlePointsAdded = (points: number) => {
    setTotalPoints((p) => p + points);
    // Re-fetch children to update totals
    fetch("/api/children")
      .then((r) => (r.ok ? r.json() : { children: [] }))
      .then((data) => setChildren(data.children ?? data ?? []))
      .catch(() => null);
  };

  const toggleChild = (id: string) => {
    setSelectedChildren((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const childOptions = children.map((c) => ({
    value: String(c.id),
    label: `${c.name} (${c.totalPoints} pts)`,
  }));

  const currentChild = children.find((c) => String(c.id) === selectedChild);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Asignar Puntos
          </h1>
          <p className="text-sm text-gray-500">
            Otorga puntos por actividades realizadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={quickMode ? "secondary" : "outline"}
            onClick={() => setQuickMode(!quickMode)}
            size="sm"
          >
            <Zap className="h-4 w-4" />
            {quickMode ? "Modo rapido activo" : "Modo rapido"}
          </Button>
        </div>
      </div>

      {/* Points counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="border-2 border-accent-200 bg-accent-50">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-accent-500" />
              <div>
                <p className="text-sm font-semibold text-accent-700">
                  Puntos otorgados esta sesion
                </p>
                <p className="text-3xl font-extrabold text-accent-600">
                  {totalPoints}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {!quickMode ? (
        /* Standard mode: single child */
        <div className="space-y-4">
          <Select
            label="Seleccionar nino"
            options={childOptions}
            value={selectedChild}
            onChange={setSelectedChild}
            placeholder="Elige un nino..."
          />

          {currentChild && (
            <motion.div
              key={selectedChild}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    Actividades para {currentChild.name}
                  </CardTitle>
                  <CardDescription>
                    Total actual: {currentChild.totalPoints} puntos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityPicker
                    childId={parseInt(selectedChild)}
                    onPointsAdded={handlePointsAdded}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      ) : (
        /* Quick mode: multiple children */
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-500" />
                Seleccionar ninos
              </CardTitle>
              <CardDescription>
                Selecciona varios ninos para asignar la misma actividad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => toggleChild(String(child.id))}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      selectedChildren.has(String(child.id))
                        ? "bg-primary-500 text-white shadow-button"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
              {selectedChildren.size > 0 && (
                <p className="mt-3 text-sm text-primary-600 font-semibold">
                  {selectedChildren.size} nino{selectedChildren.size !== 1 ? "s" : ""} seleccionado{selectedChildren.size !== 1 ? "s" : ""}
                </p>
              )}
            </CardContent>
          </Card>

          {selectedChildren.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Asignar actividad</CardTitle>
                <CardDescription>
                  Se asignara a todos los ninos seleccionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityPicker
                  childIds={Array.from(selectedChildren).map(Number)}
                  onPointsAdded={handlePointsAdded}
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
