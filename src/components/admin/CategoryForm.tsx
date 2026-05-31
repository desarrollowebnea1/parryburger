"use client";

import { FormEvent, useState } from "react";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import { AdminCheckbox, AdminInput, AdminTextarea } from "@/components/admin/AdminFields";
import { adminFetch } from "@/lib/admin/api-client";

export type CategoryFormValues = {
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
};

type CategoryFormProps = {
  initial?: Partial<CategoryFormValues>;
  categoryId?: string;
  onSuccess: () => void;
};

export default function CategoryForm({
  initial,
  categoryId,
  onSuccess,
}: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    active: initial?.active ?? true,
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
      description: values.description || null,
      sortOrder: Number(values.sortOrder),
    };

    try {
      if (categoryId) {
        await adminFetch(`/api/admin/categories/${categoryId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setSuccess("Categoría actualizada.");
      } else {
        await adminFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccess("Categoría creada.");
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

      <AdminCheckbox
        label="Activa"
        checked={values.active}
        onChange={(e) => setValues({ ...values, active: e.target.checked })}
      />

      <AdminButton type="submit" disabled={loading}>
        {loading ? "Guardando..." : categoryId ? "Guardar cambios" : "Crear categoría"}
      </AdminButton>
    </form>
  );
}
