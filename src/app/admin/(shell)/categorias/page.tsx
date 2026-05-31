"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import { adminFetch } from "@/lib/admin/api-client";

type Category = {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
  productCount: number;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminFetch<{ categories: Category[] }>("/api/admin/categories")
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleActive(category: Category) {
    try {
      await adminFetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !category.active }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function removeCategory(category: Category) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    try {
      await adminFetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl tracking-[2px] text-brand-orange">Categorías</h2>
        <AdminButton href="/admin/categorias/nueva">+ Nueva categoría</AdminButton>
      </div>

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="text-brand-cream/40">
                <th className="pb-2">Nombre</th>
                <th className="pb-2">Productos</th>
                <th className="pb-2">Orden</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-t border-brand-gray1/60">
                  <td className="py-3 font-bold">{category.name}</td>
                  <td className="py-3">{category.productCount}</td>
                  <td className="py-3">{category.sortOrder}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(category)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                        category.active
                          ? "bg-whatsapp/15 text-whatsapp"
                          : "bg-brand-gray1 text-brand-cream/40"
                      }`}
                    >
                      {category.active ? "Activa" : "Inactiva"}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/categorias/${category.id}/editar`}
                        className="text-xs font-bold text-brand-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={category.productCount > 0}
                        onClick={() => removeCategory(category)}
                        className="text-xs font-bold text-[#c0392b] hover:underline disabled:cursor-not-allowed disabled:opacity-30"
                        title={
                          category.productCount > 0
                            ? "No se puede eliminar con productos"
                            : undefined
                        }
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
