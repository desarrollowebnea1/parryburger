"use client";

import PublicImage from "@/components/public/PublicImage";
import { PromoIncludesInline } from "@/components/public/PromoIncludes";
import { formatMoney } from "@/lib/format";
import { getIncludedProductNames } from "@/lib/promo-includes";
import type { PublicPromo } from "@/types";
import { usePublicStore } from "@/context/PublicStoreProvider";

type PromoCardProps = {
  promo: PublicPromo;
};

export default function PromoCard({ promo }: PromoCardProps) {
  const { openModal, addPromoToCart } = usePublicStore();
  const includedNames = getIncludedProductNames(promo.products);

  return (
    <div
      className="promo-card"
      onClick={() => openModal({ type: "promo", promo })}
      onKeyDown={(event) => {
        if (event.key === "Enter") openModal({ type: "promo", promo });
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative">
        <PublicImage
          src={promo.imageUrl}
          alt={promo.title}
          position={promo.imagePosition}
          heightClass="h-[155px]"
          sizes="(max-width: 1024px) 85vw, 400px"
        />
        <div className="absolute right-2.5 top-2.5 rounded bg-brand-orange px-2 py-1 text-[9px] font-black uppercase tracking-[2px] text-white">
          PROMO
        </div>
      </div>
      <div className="p-[15px]">
        <h3 className="mb-0.5 font-cond text-xl font-black uppercase text-brand-cream">
          {promo.title}
        </h3>
        {promo.description ? (
          <p className="mb-1.5 text-xs leading-snug text-brand-cream/45">{promo.description}</p>
        ) : null}
        <PromoIncludesInline
          names={includedNames}
          className="mb-3 text-[11px] leading-snug text-brand-cream/35"
        />
        {!promo.description && !includedNames.length ? <div className="mb-3" /> : null}
        <div className="flex items-center justify-between">
          <div className="font-display text-[30px] text-brand-orange">
            {formatMoney(promo.price)}
          </div>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={(event) => {
              event.stopPropagation();
              addPromoToCart(promo);
            }}
            aria-label={`Agregar ${promo.title}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
