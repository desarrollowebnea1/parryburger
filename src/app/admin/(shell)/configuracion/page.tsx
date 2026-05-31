"use client";

import { useEffect, useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import SettingsForm from "@/components/admin/SettingsForm";
import { adminFetch } from "@/lib/admin/api-client";
import type { PublicOpeningHour, PublicPaymentMethod } from "@/types";

type SettingsData = {
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
  openingHoursJson: unknown;
  paymentMethodsJson: unknown;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<{ settings: SettingsData }>("/api/admin/settings")
      .then((data) => setSettings(data.settings))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  if (error) return <p className="text-sm text-brand-orange">{error}</p>;
  if (!settings) return <p className="text-sm text-brand-cream/50">Cargando configuración...</p>;

  return (
    <div>
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Configuración
      </h2>
      <AdminCard title="Datos del negocio">
        <SettingsForm
          initial={{
            ...settings,
            openingHoursJson: (settings.openingHoursJson as PublicOpeningHour[]) ?? [],
            paymentMethodsJson: (settings.paymentMethodsJson as PublicPaymentMethod[]) ?? [],
          }}
        />
      </AdminCard>
    </div>
  );
}
