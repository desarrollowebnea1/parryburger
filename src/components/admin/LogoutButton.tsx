"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
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
      className="rounded-md border border-brand-gray1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-cream/45 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-50"
    >
      {loading ? "..." : "Salir"}
    </button>
  );
}
