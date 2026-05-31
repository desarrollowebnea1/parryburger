"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import { adminFetch } from "@/lib/admin/api-client";
import { formatMoney } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  price: number;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  category: { name: string } | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminFetch<{ products: Product[] }>("/api/admin/products")
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleActive(product: Product) {
    try {
      await adminFetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !product.active }),
      });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function removeProduct(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-3xl tracking-[2px] text-brand-orange">Productos</h2>
        <AdminButton href="/admin/productos/nuevo">+ Nuevo producto</AdminButton>
      </div>

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="text-brand-cream/40">
                <th className="pb-2">Nombre</th>
                <th className="pb-2">Categoría</th>
                <th className="pb-2">Precio</th>
                <th className="pb-2">Orden</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-brand-gray1/60">
                  <td className="py-3 font-bold">
                    {product.name}
                    {product.featured ? (
                      <span className="ml-2 text-[10px] text-brand-yellow">★</span>
                    ) : null}
                  </td>
                  <td className="py-3">{product.category?.name ?? "—"}</td>
                  <td className="py-3">{formatMoney(product.price)}</td>
                  <td className="py-3">{product.sortOrder}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => toggleActive(product)}
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                        product.active
                          ? "bg-whatsapp/15 text-whatsapp"
                          : "bg-brand-gray1 text-brand-cream/40"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/productos/${product.id}/editar`}
                        className="text-xs font-bold text-brand-orange hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
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
