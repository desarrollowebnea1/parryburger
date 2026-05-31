"use client";

import { usePublicStore } from "@/context/PublicStoreProvider";

export default function MapSection() {
  const { settings } = usePublicStore();

  return (
    <div className="info-card">
      <div className="info-card-title">🗺️ Dónde Estamos</div>
      {settings.address ? (
        <div className="mb-2.5 text-sm text-brand-cream/65">📍 {settings.address}</div>
      ) : null}
      {settings.mapsEmbedUrl ? (
        <div className="mt-2 h-[150px] overflow-hidden rounded-lg">
          <iframe
            src={settings.mapsEmbedUrl}
            title="Mapa Parry Burger Express"
            className="h-full w-full border-none"
            loading="lazy"
            allowFullScreen
          />
        </div>
      ) : null}
      {settings.mapsUrl ? (
        <a
          href={settings.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2.5 block text-center text-xs font-bold uppercase tracking-wide text-brand-orange"
        >
          Abrir en Google Maps →
        </a>
      ) : null}
    </div>
  );
}
