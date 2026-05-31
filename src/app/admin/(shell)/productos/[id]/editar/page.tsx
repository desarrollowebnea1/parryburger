"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import ProductForm from "@/components/admin/ProductForm";
import { adminFetch } from "@/lib/admin/api-client";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [product, setProduct] = useState<{
    name: string;
    description: string | null;
    price: number;
    categoryId: string;
    imageUrl: string | null;
    imagePosition: string;
    active: boolean;
    featured: boolean;
    sortOrder: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      adminFetch<{ categories: { id: string; name: string }[] }>("/api/admin/categories"),
      adminFetch<{ product: NonNullable<typeof product> & { id: string } }>(
        `/api/admin/products/${params.id}`,
      ),
    ]).then(([cats, prod]) => {
      setCategories(cats.categories);
      setProduct(prod.product);
    });
  }, [params.id]);

  if (!product) {
    return <p className="text-sm text-brand-cream/50">Cargando producto...</p>;
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Editar producto
      </h2>
      <AdminCard title={product.name}>
        <ProductForm
          productId={params.id}
          categories={categories}
          initial={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl ?? "",
            imagePosition: product.imagePosition,
            active: product.active,
            featured: product.featured,
            sortOrder: product.sortOrder,
          }}
          onSuccess={() => router.push("/admin/productos")}
        />
      </AdminCard>
    </div>
  );
}
