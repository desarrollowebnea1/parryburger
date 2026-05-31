"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { TRACKING_STATUS_LABELS } from "@/lib/orders/tracking";
import { formatMoney } from "@/lib/format";
import { usePublicStore } from "@/context/PublicStoreProvider";
import type { StoredOrderHistoryEntry } from "@/lib/order-tracking-storage";

const STATUS_COLORS: Record<string, string> = {
  NUEVO: "text-brand-orange",
  PREPARANDO: "text-brand-yellow",
  EN_CAMINO: "text-blue-300",
  ENTREGADO: "text-whatsapp",
  CANCELADO: "text-[#c0392b]",
};

type RecentOrdersPanelProps = {
  variant?: "sidebar" | "drawer";
};

export default function RecentOrdersPanel({
  variant = "sidebar",
}: RecentOrdersPanelProps) {
  const { orderHistory, refreshOrderHistory, repeatOrder } = usePublicStore();
  const [repeatingCode, setRepeatingCode] = useState<string | null>(null);

  useEffect(() => {
    refreshOrderHistory();
    const interval = window.setInterval(refreshOrderHistory, 60000);
    return () => window.clearInterval(interval);
  }, [refreshOrderHistory]);

  const handleRepeat = useCallback(
    async (orderCode: string) => {
      setRepeatingCode(orderCode);
      try {
        await repeatOrder(orderCode);
      } finally {
        setRepeatingCode(null);
      }
    },
    [repeatOrder],
  );

  if (!orderHistory.length) return null;

  return (
    <div
      className={
        variant === "drawer"
          ? "mt-4 rounded-brand border border-brand-gray1 bg-brand-black3 p-4"
          : "mt-3.5 rounded-brand border border-brand-gray1 bg-brand-black3 p-[18px]"
      }
    >
      <div className="mb-3 font-cond text-sm font-black uppercase tracking-[2px] text-brand-cream/40">
        Mis pedidos recientes
      </div>

      <ul className="space-y-3">
        {orderHistory.map((entry: StoredOrderHistoryEntry) => (
          <li
            key={entry.orderCode}
            className="rounded-lg border border-brand-gray1/60 bg-brand-black2 p-3"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <strong className="font-display text-lg tracking-wide text-brand-orange">
                {entry.orderCode}
              </strong>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide ${STATUS_COLORS[entry.status] ?? "text-brand-cream/50"}`}
              >
                {TRACKING_STATUS_LABELS[entry.status]}
              </span>
            </div>

            <p className="text-[11px] text-brand-cream/40">
              {new Date(entry.createdAt).toLocaleString("es-AR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>

            {entry.total > 0 ? (
              <p className="mt-1 text-sm font-bold text-brand-cream">
                {formatMoney(entry.total)}
              </p>
            ) : null}

            {entry.summary ? (
              <p className="mt-1 line-clamp-2 text-[11px] text-brand-cream/45">
                {entry.summary}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/pedido/${encodeURIComponent(entry.orderCode)}`}
                className="rounded-md border border-brand-orange/40 bg-brand-orange/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-orange no-underline transition-colors hover:bg-brand-orange/20"
              >
                Ver estado
              </Link>
              <button
                type="button"
                disabled={repeatingCode === entry.orderCode}
                onClick={() => handleRepeat(entry.orderCode)}
                className="rounded-md border border-brand-gray1 bg-brand-black3 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-brand-cream/70 transition-colors hover:border-brand-orange/30 hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
              >
                {repeatingCode === entry.orderCode
                  ? "Cargando..."
                  : "Repetir pedido"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
