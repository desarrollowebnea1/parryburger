"use client";

import { FormEvent, useState } from "react";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import {
  AdminCheckbox,
  AdminInput,
  AdminSelect,
  AdminTextarea,
} from "@/components/admin/AdminFields";
import ImagePositionField from "@/components/admin/ImagePositionField";
import AdminFormFooter from "@/components/admin/AdminFormFooter";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api-client";
import { normalizeImagePosition } from "@/lib/image-position";

type CategoryOption = { id: string; name: string };

export type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  imagePosition: string;
  active: boolean;
  featured: boolean;
  sortOrder: number;
};

type ProductFormProps = {
  categories: CategoryOption[];
  initial?: Partial<ProductFormValues>;
  productId?: string;
  onSuccess: () => void;
};

export default function ProductForm({
  categories,
  initial,
  productId,
  onSuccess,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    imageUrl: initial?.imageUrl ?? "",
    imagePosition: normalizeImagePosition(initial?.imagePosition),
    active: initial?.active ?? true,
    featured: initial?.featured ?? false,
    sortOrder: initial?.sortOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const payload = {
      ...values,
      description: values.description || undefined,
      imageUrl: values.imageUrl || null,
      price: Number(values.price),
      sortOrder: Number(values.sortOrder),
    };

    try {
      if (productId) {
        await adminFetch(`/api/admin/products/${productId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Producto actualizado.");
      } else {
        await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Producto creado.");
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
          label="Nombre *"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
        <AdminInput
          label="Precio *"
          type="number"
          min={0}
          step={1}
          value={values.price}
          onChange={(e) => setValues({ ...values, price: Number(e.target.value) })}
          required
        />
        <AdminSelect
          label="Categoría *"
          value={values.categoryId}
          onChange={(e) => setValues({ ...values, categoryId: e.target.value })}
          required
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </AdminSelect>
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
        label="Imagen del producto"
        folder="products"
        value={values.imageUrl}
        onChange={(url) => setValues({ ...values, imageUrl: url })}
      />

      <ImagePositionField
        value={values.imagePosition}
        onChange={(imagePosition) => setValues({ ...values, imagePosition })}
      />

      <div className="flex flex-wrap gap-4">
        <AdminCheckbox
          label="Activo (disponible)"
          checked={values.active}
          onChange={(e) => setValues({ ...values, active: e.target.checked })}
        />
        <AdminCheckbox
          label="Destacado"
          checked={values.featured}
          onChange={(e) => setValues({ ...values, featured: e.target.checked })}
        />
      </div>

      <AdminFormFooter>
        <AdminButton type="submit" disabled={loading}>
          {loading ? "Guardando..." : productId ? "Guardar cambios" : "Crear producto"}
        </AdminButton>
      </AdminFormFooter>
    </form>
  );
}
