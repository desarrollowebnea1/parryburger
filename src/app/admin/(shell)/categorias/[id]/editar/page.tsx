"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import CategoryForm from "@/components/admin/CategoryForm";
import { adminFetch } from "@/lib/admin/api-client";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [category, setCategory] = useState<{
    name: string;
    description: string | null;
    active: boolean;
    sortOrder: number;
  } | null>(null);

  useEffect(() => {
    adminFetch<{ category: NonNullable<typeof category> }>(
      `/api/admin/categories/${params.id}`,
    ).then((data) => setCategory(data.category));
  }, [params.id]);

  if (!category) {
    return <p className="text-sm text-brand-cream/50">Cargando categoría...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Editar categoría
      </h2>
      <AdminCard title={category.name}>
        <CategoryForm
          categoryId={params.id}
          initial={{
            name: category.name,
            description: category.description ?? "",
            active: category.active,
            sortOrder: category.sortOrder,
          }}
          onSuccess={() => router.push("/admin/categorias")}
        />
      </AdminCard>
    </div>
  );
}
