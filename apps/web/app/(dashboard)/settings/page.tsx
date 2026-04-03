"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Save, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function SettingsPage() {
  // Profile state
  const [profile, setProfile] = React.useState({ name: "", email: "", avatarUrl: "" });
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileSuccess, setProfileSuccess] = React.useState(false);
  const [profileError, setProfileError] = React.useState("");

  // Password state
  const [passwords, setPasswords] = React.useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setProfile({
            name: data.user.name ?? "",
            email: data.user.email ?? "",
            avatarUrl: data.user.avatarUrl ?? "",
          });
        }
      })
      .catch(() => null);
  }, []);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setProfileLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al guardar perfil");
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwords.newPassword !== passwords.confirm) {
      setPasswordError("Las contrasenas no coinciden");
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al cambiar contrasena");
      }
      setPasswordSuccess(true);
      setPasswords({ current: "", newPassword: "", confirm: "" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Error");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Configuracion</h1>
        <p className="text-sm text-gray-500">Gestiona tu perfil y preferencias</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-1.5 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-1.5 h-4 w-4" />
            Contrasena
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-1.5 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Editar perfil</CardTitle>
              <CardDescription>
                Actualiza tu informacion personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-4">
                {profileError && (
                  <div className="rounded-[var(--radius-button)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                    {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-[var(--radius-button)] bg-success-50 border border-success-200 px-4 py-3 text-sm text-success-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Perfil guardado correctamente
                  </motion.div>
                )}
                <Input
                  label="Nombre"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  required
                />
                <Input
                  label="Correo electronico"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  required
                />
                <Input
                  label="URL del avatar"
                  type="url"
                  placeholder="https://..."
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile((p) => ({ ...p, avatarUrl: e.target.value }))}
                />
                <Button type="submit" loading={profileLoading}>
                  <Save className="h-4 w-4" />
                  Guardar cambios
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar contrasena</CardTitle>
              <CardDescription>
                Ingresa tu contrasena actual y la nueva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && (
                  <div className="rounded-[var(--radius-button)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700" role="alert">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-[var(--radius-button)] bg-success-50 border border-success-200 px-4 py-3 text-sm text-success-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Contrasena cambiada correctamente
                  </motion.div>
                )}
                <Input
                  label="Contrasena actual"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
                <Input
                  label="Nueva contrasena"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                  required
                  autoComplete="new-password"
                />
                <Input
                  label="Confirmar nueva contrasena"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  required
                  autoComplete="new-password"
                />
                <Button type="submit" loading={passwordLoading}>
                  <Lock className="h-4 w-4" />
                  Cambiar contrasena
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>
                Configuracion de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4 py-8">
                <Bell className="h-12 w-12 text-gray-300" />
                <p className="text-gray-500 text-center">
                  Las notificaciones estaran disponibles proximamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
