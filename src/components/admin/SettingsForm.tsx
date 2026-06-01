"use client";

import { FormEvent, useState } from "react";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import { AdminCheckbox, AdminInput, AdminTextarea } from "@/components/admin/AdminFields";
import ImagePositionField from "@/components/admin/ImagePositionField";
import AdminFormFooter from "@/components/admin/AdminFormFooter";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { adminFetch } from "@/lib/admin/api-client";
import { normalizeImagePosition } from "@/lib/image-position";
import type { PublicOpeningHour, PublicPaymentMethod } from "@/types";

type SettingsFormProps = {
  initial: {
    businessName: string;
    slogan: string | null;
    whatsappNumber: string;
    instagramUrl: string | null;
    facebookUrl: string | null;
    address: string | null;
    mapsUrl: string | null;
    mapsEmbedUrl: string | null;
    deliveryCost: number;
    heroTag: string | null;
    heroTitleLine1: string | null;
    heroTitleLine2: string | null;
    heroTitleLine3: string | null;
    heroDescription: string | null;
    heroImageUrl: string | null;
    heroImagePosition: string;
    footerText: string | null;
    openingHoursJson: PublicOpeningHour[];
    paymentMethodsJson: PublicPaymentMethod[];
  };
};

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateHour(index: number, field: keyof PublicOpeningHour, value: string) {
    setValues((prev) => ({
      ...prev,
      openingHoursJson: prev.openingHoursJson.map((hour, i) =>
        i === index ? { ...hour, [field]: value } : hour,
      ),
    }));
  }

  function updatePayment(index: number, field: keyof PublicPaymentMethod, value: string | boolean) {
    setValues((prev) => ({
      ...prev,
      paymentMethodsJson: prev.paymentMethodsJson.map((method, i) =>
        i === index ? { ...method, [field]: value } : method,
      ),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          businessName: values.businessName,
          slogan: values.slogan || null,
          whatsappNumber: values.whatsappNumber,
          instagramUrl: values.instagramUrl || null,
          facebookUrl: values.facebookUrl || null,
          address: values.address || null,
          mapsUrl: values.mapsUrl || null,
          mapsEmbedUrl: values.mapsEmbedUrl || null,
          deliveryCost: Number(values.deliveryCost),
          heroTag: values.heroTag || null,
          heroTitleLine1: values.heroTitleLine1 || null,
          heroTitleLine2: values.heroTitleLine2 || null,
          heroTitleLine3: values.heroTitleLine3 || null,
          heroDescription: values.heroDescription || null,
          heroImageUrl: values.heroImageUrl || null,
          heroImagePosition: normalizeImagePosition(values.heroImagePosition),
          footerText: values.footerText || null,
          openingHoursJson: values.openingHoursJson,
          paymentMethodsJson: values.paymentMethodsJson,
        }),
      });
      setSuccess("Configuración guardada correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminAlert type="error" message={error} />
      <AdminAlert type="success" message={success} />

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          Negocio
        </h4>
        <div className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label="Nombre del negocio *"
            value={values.businessName}
            onChange={(e) => setValues({ ...values, businessName: e.target.value })}
            required
          />
          <AdminInput
            label="Slogan"
            value={values.slogan ?? ""}
            onChange={(e) => setValues({ ...values, slogan: e.target.value })}
          />
          <AdminInput
            label="Costo de envío"
            type="number"
            min={0}
            value={values.deliveryCost}
            onChange={(e) => setValues({ ...values, deliveryCost: Number(e.target.value) })}
          />
        </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          WhatsApp y redes
        </h4>
        <div className="mt-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <AdminInput
            label="WhatsApp (solo dígitos) *"
            value={values.whatsappNumber}
            onChange={(e) => setValues({ ...values, whatsappNumber: e.target.value })}
            required
            className="md:col-span-2"
          />
          <AdminInput
            label="Instagram URL"
            value={values.instagramUrl ?? ""}
            onChange={(e) => setValues({ ...values, instagramUrl: e.target.value })}
          />
          <AdminInput
            label="Facebook URL"
            value={values.facebookUrl ?? ""}
            onChange={(e) => setValues({ ...values, facebookUrl: e.target.value })}
          />
          <AdminInput
            label="Dirección"
            value={values.address ?? ""}
            onChange={(e) => setValues({ ...values, address: e.target.value })}
            className="md:col-span-2"
          />
          <AdminInput
            label="Google Maps URL"
            value={values.mapsUrl ?? ""}
            onChange={(e) => setValues({ ...values, mapsUrl: e.target.value })}
          />
          <AdminInput
            label="Google Maps embed URL"
            value={values.mapsEmbedUrl ?? ""}
            onChange={(e) => setValues({ ...values, mapsEmbedUrl: e.target.value })}
          />
        </div>
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          Hero (inicio)
        </h4>
        <div className="mt-4 space-y-4">
        <AdminInput
          label="Etiqueta hero"
          value={values.heroTag ?? ""}
          onChange={(e) => setValues({ ...values, heroTag: e.target.value })}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <AdminInput
            label="Título línea 1"
            value={values.heroTitleLine1 ?? ""}
            onChange={(e) => setValues({ ...values, heroTitleLine1: e.target.value })}
          />
          <AdminInput
            label="Título línea 2"
            value={values.heroTitleLine2 ?? ""}
            onChange={(e) => setValues({ ...values, heroTitleLine2: e.target.value })}
          />
          <AdminInput
            label="Título línea 3"
            value={values.heroTitleLine3 ?? ""}
            onChange={(e) => setValues({ ...values, heroTitleLine3: e.target.value })}
          />
        </div>
        <AdminTextarea
          label="Descripción hero"
          value={values.heroDescription ?? ""}
          onChange={(e) => setValues({ ...values, heroDescription: e.target.value })}
        />
        <ImageUploadField
          label="Imagen hero"
          folder="hero"
          value={values.heroImageUrl ?? ""}
          onChange={(url) => setValues({ ...values, heroImageUrl: url })}
        />
        <ImagePositionField
          label="Posición de imagen hero"
          value={values.heroImagePosition}
          onChange={(heroImagePosition) =>
            setValues({ ...values, heroImagePosition })
          }
        />
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          Horarios
        </h4>
        <div className="mt-4 space-y-3">
        {values.openingHoursJson.map((hour, index) => (
          <div key={hour.id || index} className="grid gap-3 rounded-lg border border-brand-gray1 p-4 md:grid-cols-2">
            <AdminInput
              label="Turno"
              value={hour.label}
              onChange={(e) => updateHour(index, "label", e.target.value)}
            />
            <AdminInput
              label="Días"
              value={hour.days}
              onChange={(e) => updateHour(index, "days", e.target.value)}
            />
            <AdminInput
              label="Horario"
              value={hour.hours}
              onChange={(e) => updateHour(index, "hours", e.target.value)}
              className="md:col-span-2"
            />
          </div>
        ))}
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          Métodos de pago
        </h4>
        <div className="mt-4 space-y-3">
        {values.paymentMethodsJson.map((method, index) => (
          <div key={method.id} className="flex flex-wrap items-center gap-4 rounded-lg border border-brand-gray1 p-4">
            <AdminInput
              label="Nombre"
              value={method.label}
              onChange={(e) => updatePayment(index, "label", e.target.value)}
              className="min-w-[200px] flex-1"
            />
            <AdminCheckbox
              label="Activo"
              checked={method.active}
              onChange={(e) => updatePayment(index, "active", e.target.checked)}
            />
          </div>
        ))}
        </div>
      </section>

      <section className="admin-form-section">
        <h4 className="font-cond text-sm font-black uppercase tracking-[2px] text-brand-orange">
          Mapa y footer
        </h4>
        <div className="mt-4">
          <AdminTextarea
            label="Texto del footer"
            value={values.footerText ?? ""}
            onChange={(e) => setValues({ ...values, footerText: e.target.value })}
          />
        </div>
      </section>

      <AdminFormFooter>
        <AdminButton type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar configuración"}
        </AdminButton>
      </AdminFormFooter>
    </form>
  );
}
