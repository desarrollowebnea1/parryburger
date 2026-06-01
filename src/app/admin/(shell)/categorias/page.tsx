"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminMobileCard from "@/components/admin/AdminMobileCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageHeader
        title="Categorías"
        action={<AdminButton href="/admin/categorias/nueva">+ Nueva categoría</AdminButton>}
      />

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <ul className="flex flex-col gap-3 md:hidden">
          {categories.map((category) => (
            <AdminMobileCard key={category.id}>
              <p className="text-lg font-bold text-brand-cream">{category.name}</p>
              <p className="mt-1 text-sm text-brand-cream/55">
                {category.productCount} productos · Orden {category.sortOrder}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(category)}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 text-[11px] font-bold uppercase ${
                    category.active
                      ? "bg-whatsapp/15 text-whatsapp"
                      : "bg-brand-gray1 text-brand-cream/40"
                  }`}
                >
                  {category.active ? "Activa" : "Inactiva"}
                </button>
                <Link
                  href={`/admin/categorias/${category.id}/editar`}
                  className="admin-action-link bg-brand-orange/10 text-brand-orange"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  disabled={category.productCount > 0}
                  onClick={() => removeCategory(category)}
                  className="admin-action-link text-[#c0392b] hover:bg-[#c0392b]/10 disabled:opacity-30"
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
