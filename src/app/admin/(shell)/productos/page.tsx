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

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  category: { name: string } | null;
};

function StatusToggle({
  active,
  onClick,
  labels,
}: {
  active: boolean;
  onClick: () => void;
  labels: [string, string];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
        active ? "bg-whatsapp/15 text-whatsapp" : "bg-brand-gray1 text-brand-cream/40"
      }`}
    >
      {active ? labels[0] : labels[1]}
    </button>
  );
}

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
      <AdminPageHeader
        title="Productos"
        action={<AdminButton href="/admin/productos/nuevo">+ Nuevo producto</AdminButton>}
      />

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado">
        <ul className="flex flex-col gap-3 md:hidden">
          {products.map((product) => (
            <AdminMobileCard key={product.id}>
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-gray1 bg-brand-black3">
                  <Image
                    src={product.imageUrl || PLACEHOLDER_FOOD}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold leading-tight text-brand-cream">
                    {product.name}
                    {product.featured ? (
                      <span className="ml-1 text-brand-yellow">★</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-brand-cream/50">
                    {product.category?.name ?? "—"} · Orden {product.sortOrder}
                  </p>
                  <p className="mt-1 font-display text-xl text-brand-orange">
                    {formatMoney(product.price)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusToggle
                  active={product.active}
                  onClick={() => toggleActive(product)}
                  labels={["Activo", "Inactivo"]}
                />
                <Link
                  href={`/admin/productos/${product.id}/editar`}
                  className="admin-action-link bg-brand-orange/10 text-brand-orange"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => removeProduct(product.id)}
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
                    <StatusToggle
                      active={product.active}
                      onClick={() => toggleActive(product)}
                      labels={["Activo", "Inactivo"]}
                    />
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
