"use client";

import PublicImage from "@/components/public/PublicImage";
import { PromoIncludesSection } from "@/components/public/PromoIncludes";
import { formatMoney } from "@/lib/format";
import { getIncludedProductNames } from "@/lib/promo-includes";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function ProductModal() {
  const { modalItem, closeModal, addProductToCart, addPromoToCart } =
    usePublicStore();

  if (!modalItem) return null;

  const isProduct = modalItem.type === "product";
  const title = isProduct ? modalItem.product.name : modalItem.promo.title;
  const description = isProduct
    ? modalItem.product.description
    : modalItem.promo.description;
  const price = isProduct ? modalItem.product.price : modalItem.promo.price;
  const imageUrl = isProduct
    ? modalItem.product.imageUrl
    : modalItem.promo.imageUrl;
  const imagePosition = isProduct
    ? modalItem.product.imagePosition
    : modalItem.promo.imagePosition;
  const includedNames = isProduct
    ? []
    : getIncludedProductNames(modalItem.promo.products);

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/88 p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div className="relative w-full max-w-[460px] animate-[modalIn_0.2s_ease] overflow-hidden rounded-[14px] border border-brand-gray2 bg-brand-black3">
        <button
          type="button"
          className="absolute right-3 top-3 z-[2] flex h-[30px] w-[30px] items-center justify-center rounded-full border-none bg-black/60 text-base text-white"
          onClick={closeModal}
        >
          ✕
        </button>

        <PublicImage
          src={imageUrl}
          alt={title}
          position={imagePosition}
          heightClass="h-[220px]"
          sizes="460px"
        />

        <div className="p-[22px]">
          {isProduct ? (
            <div className="mb-2.5 inline-block rounded border border-brand-orange/25 bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[2px] text-brand-orange">
              {modalItem.categoryName}
            </div>
          ) : (
            <div className="mb-2.5 inline-block rounded border border-brand-orange/25 bg-brand-orange/10 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[2px] text-brand-orange">
              PROMO
            </div>
          )}

          <div className="mb-1 font-cond text-[26px] font-black uppercase">{title}</div>
          {description ? (
            <p className="mb-3.5 text-[13px] text-brand-cream/45">{description}</p>
          ) : null}
          {!isProduct ? <PromoIncludesSection names={includedNames} /> : null}
          <div className="mb-[18px] font-display text-[40px] text-brand-orange">
            {formatMoney(price)}
          </div>

          <button
            type="button"
            className="w-full rounded-lg border-none bg-brand-orange py-[13px] text-[15px] font-black text-white transition-colors hover:bg-brand-orange-dark"
            onClick={() => {
              if (isProduct) {
                addProductToCart(modalItem.product);
              } else {
                addPromoToCart(modalItem.promo);
              }
              closeModal();
            }}
          >
            + Agregar al Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
