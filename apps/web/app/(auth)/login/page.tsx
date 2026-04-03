"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Credenciales incorrectas");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Bienvenido de vuelta!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Inicia sesion para continuar en JordanList
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
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="pl-10"
          />
        </div>

        <Button type="submit" className="w-full" loading={loading} size="lg">
          <LogIn className="h-4 w-4" />
          Iniciar sesion
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline"
        >
          Registrate aqui
        </Link>
      </p>
    </div>
  );
}
