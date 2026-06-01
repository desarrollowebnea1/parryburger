"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminMobileCard from "@/components/admin/AdminMobileCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminFetch } from "@/lib/admin/api-client";
import { formatMoney, PLACEHOLDER_FOOD } from "@/lib/format";

type Promo = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
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
      <AdminPageHeader
        title="Promociones"
        action={<AdminButton href="/admin/promociones/nueva">+ Nueva promoción</AdminButton>}
      />

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <ul className="flex flex-col gap-3 md:hidden">
          {promos.map((promo) => (
            <AdminMobileCard key={promo.id}>
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-gray1">
                  <Image
                    src={promo.imageUrl || PLACEHOLDER_FOOD}
                    alt={promo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-brand-cream">
                    {promo.title}
                    {promo.featured ? (
                      <span className="ml-1 text-brand-yellow">★</span>
                    ) : null}
                  </p>
                  <p className="mt-1 font-display text-xl text-brand-orange">
                    {formatMoney(promo.price)}
                  </p>
                  <p className="text-xs text-brand-cream/45">Orden {promo.sortOrder}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(promo)}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 text-[11px] font-bold uppercase ${
                    promo.active
                      ? "bg-whatsapp/15 text-whatsapp"
                      : "bg-brand-gray1 text-brand-cream/40"
                  }`}
                >
                  {promo.active ? "Activa" : "Inactiva"}
                </button>
                <Link
                  href={`/admin/promociones/${promo.id}/editar`}
                  className="admin-action-link bg-brand-orange/10 text-brand-orange"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => removePromo(promo.id)}
                  className="admin-action-link text-[#c0392b] hover:bg-[#c0392b]/10"
                >
                  Eliminar
                </button>
              </div>
            </AdminMobileCard>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="admin-table w-full text-left text-sm">
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
