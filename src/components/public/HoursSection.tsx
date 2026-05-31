"use client";

import { usePublicStore } from "@/context/PublicStoreProvider";

const ICONS = ["☀️", "🌙", "⭐", "🔥"];

export default function HoursSection() {
  const { settings } = usePublicStore();

  return (
    <div className="info-card">
      <div className="info-card-title">⏰ Horarios</div>
      {settings.openingHours.length ? (
        settings.openingHours.map((hour, index) => (
          <div key={hour.id || index} className="mb-3.5 flex gap-3">
            <div className="mt-0.5 text-xl">{ICONS[index] || "🕐"}</div>
            <div className="horario-text">
              <strong className="block text-[13px] font-extrabold">{hour.label}</strong>
              <span className="mt-px block text-xs text-brand-cream/45">{hour.days}</span>
              <span className="mt-px block text-xs text-brand-cream/45">{hour.hours}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-brand-cream/40">Horarios no disponibles.</p>
      )}
    </div>
  );
}
