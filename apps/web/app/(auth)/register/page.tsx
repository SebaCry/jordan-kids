"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Error al registrarse");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Unete a JordanList!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Crea tu cuenta y comienza a ganar puntos
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="rounded-[var(--radius-button)] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="relative">
          <User className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            label="Correo electronico"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            label="Contrasena"
            type="password"
            placeholder="Minimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" aria-hidden="true" />
          <Input
            label="Confirmar contrasena"
            type="password"
            placeholder="Repite tu contrasena"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="pl-10"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading} size="lg">
          <UserPlus className="h-4 w-4" />
          Crear cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
        >
          Inicia sesion
        </Link>
      </p>
    </div>
  );
}
