"use client";

import { FormEvent, useEffect, useState } from "react";
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
import { AdminApiError, adminFetch } from "@/lib/admin/api-client";
import { normalizeImagePosition } from "@/lib/image-position";
import type { CreateProductInput } from "@/lib/validators/product";

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

function buildProductPayload(values: ProductFormValues): CreateProductInput {
  const name = values.name.trim();
  const price = Number(values.price);
  const sortOrder = Number(values.sortOrder);
  const imageUrl = values.imageUrl.trim();

  if (!name) {
    throw new Error("El nombre es obligatorio.");
  }

  if (!values.categoryId) {
    throw new Error("Debe seleccionar una categoría válida.");
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("El precio debe ser un número válido mayor a 0.");
  }

  if (!Number.isFinite(sortOrder) || sortOrder < 0) {
    throw new Error("El orden debe ser un número entero válido.");
  }

  const payload: CreateProductInput = {
    name,
    categoryId: values.categoryId,
    price,
    sortOrder: Math.trunc(sortOrder),
    active: values.active,
    featured: values.featured,
    imagePosition: normalizeImagePosition(values.imagePosition),
    imageUrl: imageUrl || null,
  };

  const description = values.description.trim();
  if (description) {
    payload.description = description;
  }

  return payload;
}

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

  useEffect(() => {
    if (categories.length === 0) return;
    setValues((prev) => {
      if (prev.categoryId && categories.some((c) => c.id === prev.categoryId)) {
        return prev;
      }
      return { ...prev, categoryId: categories[0].id };
    });
  }, [categories]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    let payload: CreateProductInput;

    try {
      payload = buildProductPayload(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Datos inválidos");
      setLoading(false);
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("[ProductForm] payload", payload);
    }

    try {
      if (productId) {
        await adminFetch(`/api/admin/products/${productId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Producto actualizado correctamente.");
      } else {
        await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Producto creado correctamente.");
      }
      onSuccess();
    } catch (err) {
      if (process.env.NODE_ENV === "development" && err instanceof AdminApiError) {
        console.debug("[ProductForm] error response", err.message, err.status);
      }
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  const categoriesReady = categories.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminAlert type="error" message={error} />
      <AdminAlert type="success" message={success} />

      {!categoriesReady ? (
        <AdminAlert
          type="error"
          message="No hay categorías activas. Creá una categoría antes de agregar productos."
        />
      ) : null}

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
          onChange={(e) =>
            setValues({
              ...values,
              price: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          required
        />
        <AdminSelect
          label="Categoría *"
          value={values.categoryId}
          onChange={(e) => setValues({ ...values, categoryId: e.target.value })}
          required
          disabled={!categoriesReady}
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
          onChange={(e) =>
            setValues({
              ...values,
              sortOrder: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
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
        <AdminButton type="submit" disabled={loading || !categoriesReady}>
          {loading ? "Guardando..." : productId ? "Guardar cambios" : "Crear producto"}
        </AdminButton>
      </AdminFormFooter>
    </form>
  );
}
