"use client";

import { FormEvent, useState } from "react";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import {
  AdminCheckbox,
  AdminInput,
  AdminTextarea,
} from "@/components/admin/AdminFields";
import ImagePositionField from "@/components/admin/ImagePositionField";
import AdminFormFooter from "@/components/admin/AdminFormFooter";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api-client";
import { normalizeImagePosition } from "@/lib/image-position";

type ProductOption = { id: string; name: string };

export type PromoFormValues = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imagePosition: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
  productIds: string[];
};

type PromoFormProps = {
  products: ProductOption[];
  initial?: Partial<PromoFormValues>;
  promoId?: string;
  onSuccess: () => void;
};

export default function PromoForm({
  products,
  initial,
  promoId,
  onSuccess,
}: PromoFormProps) {
  const [values, setValues] = useState<PromoFormValues>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    imageUrl: initial?.imageUrl ?? "",
    imagePosition: normalizeImagePosition(initial?.imagePosition),
    active: initial?.active ?? true,
    featured: initial?.featured ?? true,
    sortOrder: initial?.sortOrder ?? 0,
    productIds: initial?.productIds ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function toggleProduct(id: string) {
    setValues((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(id)
        ? prev.productIds.filter((pid) => pid !== id)
        : [...prev.productIds, id],
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      ...values,
      description: values.description || null,
      imageUrl: values.imageUrl || null,
      price: Number(values.price),
      sortOrder: Number(values.sortOrder),
    };

    try {
      if (promoId) {
        await adminFetch(`/api/admin/promos/${promoId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Promoción actualizada.");
      } else {
        await adminFetch("/api/admin/promos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Promoción creada.");
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminAlert type="error" message={error} />
      <AdminAlert type="success" message={success} />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput
          label="Título *"
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          required
        />
        <AdminInput
          label="Precio *"
          type="number"
          min={0}
          value={values.price}
          onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
          required
        />
        <AdminInput
          label="Orden"
          type="number"
          min={0}
          value={values.sortOrder}
          onChange={(e) => setValues({ ...values, sortOrder: Number(e.target.value) })}
        />
      </div>

      <AdminTextarea
        label="Descripción"
        value={values.description}
        onChange={(e) => setValues({ ...values, description: e.target.value })}
      />

      <ImageUploadField
        label="Imagen de la promo"
        folder="promos"
        value={values.imageUrl}
        onChange={(url) => setValues({ ...values, imageUrl: url })}
      />

      <ImagePositionField
        value={values.imagePosition}
        onChange={(imagePosition) => setValues({ ...values, imagePosition })}
      />

      <div>
        <span className="admin-label mb-2 block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
          Productos incluidos (opcional)
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          {products.map((product) => (
            <AdminCheckbox
              key={product.id}
              label={product.name}
              checked={values.productIds.includes(product.id)}
              onChange={() => toggleProduct(product.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <AdminCheckbox
          label="Activa"
          checked={values.active}
          onChange={(e) => setValues({ ...values, active: e.target.checked })}
        />
        <AdminCheckbox
          label="Destacada"
          checked={values.featured}
          onChange={(e) => setValues({ ...values, featured: e.target.checked })}
        />
      </div>

      <AdminFormFooter>
        <AdminButton type="submit" disabled={loading}>
          {loading ? "Guardando..." : promoId ? "Guardar cambios" : "Crear promoción"}
        </AdminButton>
      </AdminFormFooter>
    </form>
  );
}
