"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import PromoForm from "@/components/admin/PromoForm";
import { adminFetch } from "@/lib/admin/api-client";

export default function NewPromoPage() {
  const router = useRouter();
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    adminFetch<{ products: { id: string; name: string }[] }>("/api/admin/products").then(
      (data) => setProducts(data.products),
    );
  }, []);

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Nueva promoción
      </h2>
      <AdminCard title="Datos de la promoción">
        <PromoForm products={products} onSuccess={() => router.push("/admin/promociones")} />
      </AdminCard>
    </div>
  );
}
