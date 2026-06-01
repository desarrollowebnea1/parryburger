"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border border-brand-gray1 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-brand-cream/45 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-50 ${className}`}
    >
      {loading ? "..." : "Salir"}
    </button>
  );
}
