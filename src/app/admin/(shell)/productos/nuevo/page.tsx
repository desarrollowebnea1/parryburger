"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import ProductForm from "@/components/admin/ProductForm";
import { adminFetch } from "@/lib/admin/api-client";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    adminFetch<{ categories: { id: string; name: string; active: boolean }[] }>(
      "/api/admin/categories",
    ).then((data) => setCategories(data.categories.filter((c) => c.active)));
  }, []);

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Nuevo producto
      </h2>
      <AdminCard title="Datos del producto">
        <ProductForm
          categories={categories}
          onSuccess={() => router.push("/admin/productos")}
        />
      </AdminCard>
    </div>
  );
}
