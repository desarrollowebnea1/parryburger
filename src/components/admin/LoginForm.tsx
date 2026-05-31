"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        return;
      }

      const from = searchParams.get("from") || "/admin";
      router.push(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-[360px] rounded-[14px] border border-brand-gray1 bg-brand-black3 p-11 text-center">
        <div className="mb-5 inline-block rounded-lg bg-brand-orange px-3.5 py-2 font-display text-[22px] tracking-[2px]">
          PARRY 🍔
        </div>

        <h1 className="mb-1.5 font-display text-[28px] tracking-[2px] text-brand-orange">
          PANEL ADMIN
        </h1>
        <p className="mb-7 text-[13px] text-brand-cream/35">
          Acceso exclusivo para administradores
        </p>

        <div
          role="alert"
          className="mb-5 rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-2.5 text-left text-xs leading-relaxed text-brand-yellow"
        >
          Cambiá la contraseña antes de publicar en producción.
        </div>

        <form onSubmit={handleSubmit} className="text-left">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-2.5 w-full rounded-lg border border-brand-gray1 bg-brand-black2 px-3.5 py-[11px] text-sm text-brand-cream outline-none transition-colors focus:border-brand-orange"
            required
          />

          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-2.5 w-full rounded-lg border border-brand-gray1 bg-brand-black2 px-3.5 py-[11px] text-sm text-brand-cream outline-none transition-colors focus:border-brand-orange"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-lg bg-brand-orange py-3 text-base font-black text-white transition-colors hover:bg-brand-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </button>

          {error ? (
            <p className="mt-2.5 min-h-4 text-center text-xs text-brand-orange">
              {error}
            </p>
          ) : null}
        </form>

        <a
          href="/"
          className="mt-4 inline-block text-xs text-brand-cream/25 transition-colors hover:text-brand-cream/50"
        >
          ← Volver al sitio
        </a>
      </div>
    </div>
  );
}
