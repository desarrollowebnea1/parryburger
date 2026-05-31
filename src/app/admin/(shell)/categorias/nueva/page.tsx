"use client";

import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Nueva categoría
      </h2>
      <AdminCard title="Datos de la categoría">
        <CategoryForm onSuccess={() => router.push("/admin/categorias")} />
      </AdminCard>
    </div>
  );
}
