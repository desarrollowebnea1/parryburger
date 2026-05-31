"use client";

import type { OrderTimelineEntry } from "@/types";

type OrderTimelineProps = {
  timeline?: OrderTimelineEntry[];
  activeOrderCode?: string | null;
  compact?: boolean;
};

const DEFAULT_STEPS = [
  { status: "NUEVO" as const, label: "Pedido recibido" },
  { status: "PREPARANDO" as const, label: "En preparación" },
  { status: "EN_CAMINO" as const, label: "En camino" },
  { status: "ENTREGADO" as const, label: "Entregado" },
];

export default function OrderTimeline({
  timeline,
  activeOrderCode,
  compact = false,
}: OrderTimelineProps) {
  const steps = timeline?.length
    ? timeline.map((entry) => ({
        label: entry.label,
        at: entry.at,
        completed: entry.completed,
        current: entry.current,
        cancelled: entry.status === "CANCELADO",
      }))
    : DEFAULT_STEPS.map((step, index) => ({
        label: step.label,
        at: null as string | null,
        completed: index === 0 && Boolean(activeOrderCode),
        current: index === 0 && Boolean(activeOrderCode),
        cancelled: false,
      }));

  return (
    <div className={compact ? "space-y-0" : "space-y-0.5"}>
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-3 py-1.5">
          <div
            className={`flex shrink-0 items-center justify-center rounded-full text-xs ${
              compact ? "h-6 w-6" : "h-7 w-7"
            } ${
              step.cancelled
                ? "bg-[#c0392b]"
                : step.current
                  ? "animate-[trackPulse_1.5s_infinite] bg-brand-orange"
                  : step.completed
                    ? "bg-whatsapp"
                    : "bg-brand-gray1"
            }`}
          >
            {step.cancelled ? "✕" : step.completed ? "✓" : "·"}
          </div>
          <div>
            <strong
              className={`block font-extrabold ${
                compact ? "text-xs" : "text-[13px]"
              }`}
            >
              {step.label}
            </strong>
            <span className="text-[11px] text-brand-cream/35">
              {step.at
                ? new Date(step.at).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
