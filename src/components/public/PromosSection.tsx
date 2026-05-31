"use client";

import PromoCard from "@/components/public/PromoCard";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function PromosSection() {
  const { promos } = usePublicStore();

  return (
    <div id="promos-section" className="mb-[52px]">
      <div className="sec-title">⚡ PROMOS DESTACADAS</div>
      {promos.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
          {promos.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-brand-cream/30">No hay promos activas.</p>
      )}
    </div>
  );
}
