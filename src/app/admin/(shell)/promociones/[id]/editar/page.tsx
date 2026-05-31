"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import PromoForm from "@/components/admin/PromoForm";
import { adminFetch } from "@/lib/admin/api-client";

export default function EditPromoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [promo, setPromo] = useState<{
    title: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    imagePosition: string;
    active: boolean;
    featured: boolean;
    sortOrder: number;
    productIds: string[];
  } | null>(null);

  useEffect(() => {
    Promise.all([
      adminFetch<{ products: { id: string; name: string }[] }>("/api/admin/products"),
      adminFetch<{ promo: NonNullable<typeof promo> & { id: string } }>(
        `/api/admin/promos/${params.id}`,
      ),
    ]).then(([prods, promoData]) => {
      setProducts(prods.products);
      setPromo(promoData.promo);
    });
  }, [params.id]);

  if (!promo) {
    return <p className="text-sm text-brand-cream/50">Cargando promoción...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Editar promoción
      </h2>
      <AdminCard title={promo.title}>
        <PromoForm
          promoId={params.id}
          products={products}
          initial={{
            title: promo.title,
            description: promo.description ?? "",
            price: promo.price,
            imageUrl: promo.imageUrl ?? "",
            imagePosition: promo.imagePosition,
            active: promo.active,
            featured: promo.featured,
            sortOrder: promo.sortOrder,
            productIds: promo.productIds,
          }}
          onSuccess={() => router.push("/admin/promociones")}
        />
      </AdminCard>
    </div>
  );
}
