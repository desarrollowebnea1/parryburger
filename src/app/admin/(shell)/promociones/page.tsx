"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import { adminFetch } from "@/lib/admin/api-client";
import { formatMoney } from "@/lib/format";

type Promo = {
  id: string;
  title: string;
  price: number;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminFetch<{ promos: Promo[] }>("/api/admin/promos")
      .then((data) => setPromos(data.promos))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleActive(promo: Promo) {
    try {
      await adminFetch(`/api/admin/promos/${promo.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !promo.active }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function removePromo(id: string) {
    if (!confirm("¿Eliminar esta promoción?")) return;
    try {
      await adminFetch(`/api/admin/promos/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl tracking-[2px] text-brand-orange">Promociones</h2>
        <AdminButton href="/admin/promociones/nueva">+ Nueva promoción</AdminButton>
      </div>

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="text-brand-cream/40">
                <th className="pb-2">Título</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2">Orden</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promos.map((promo) => (
                <tr key={promo.id} className="border-t border-brand-gray1/60">
                  <td className="py-3 font-bold">
                    {promo.title}
                    {promo.featured ? (
                      <span className="ml-2 text-[10px] text-brand-yellow">★</span>
                    ) : null}
                  </td>
                  <td className="py-3">{formatMoney(promo.price)}</td>
                  <td className="py-3">{promo.sortOrder}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(promo)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                        promo.active
                          ? "bg-whatsapp/15 text-whatsapp"
                          : "bg-brand-gray1 text-brand-cream/40"
                      }`}
                    >
                      {promo.active ? "Activa" : "Inactiva"}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/promociones/${promo.id}/editar`}
                        className="text-xs font-bold text-brand-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => removePromo(promo.id)}
                        className="text-xs font-bold text-[#c0392b] hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
