"use client";

import OrderTimeline from "@/components/public/OrderTimeline";
import Link from "next/link";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function OrderTracker() {
  const { activeOrderCode, tracking } = usePublicStore();

  if (!activeOrderCode) return null;

  const trackingHref = `/pedido/${encodeURIComponent(activeOrderCode)}`;

  return (
    <div className="tracking-box mt-3.5 rounded-brand border border-brand-gray1 bg-brand-black3 p-[18px]">
      <div className="tracking-title mb-3.5 font-cond text-sm font-black uppercase tracking-[2px] text-brand-cream/40">
        Seguí tu pedido
      </div>

      <p className="mb-3 text-xs font-bold text-brand-orange">
        Código: {activeOrderCode}
      </p>

      <OrderTimeline
        timeline={tracking?.timeline}
        activeOrderCode={activeOrderCode}
      />

      <Link
        href={trackingHref}
        className="mt-4 block rounded-lg border border-brand-orange/40 bg-brand-orange/10 px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-brand-orange no-underline transition-colors hover:bg-brand-orange/20"
      >
        Ver página de seguimiento
      </Link>
    </div>
  );
}
