"use client";

import PublicImage from "@/components/public/PublicImage";
import { formatMoney } from "@/lib/format";
import type { PublicProduct } from "@/types";
import { usePublicStore } from "@/context/PublicStoreProvider";

type ProductCardProps = {
  product: PublicProduct;
  categoryName: string;
};

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  const { openModal, addProductToCart } = usePublicStore();

  return (
    <div
      className="menu-card"
      onClick={() => openModal({ type: "product", product, categoryName })}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          openModal({ type: "product", product, categoryName });
        }
      }}
      role="button"
      tabIndex={0}
    >
      <PublicImage
        src={product.imageUrl}
        alt={product.name}
        position={product.imagePosition}
        heightClass="h-[135px]"
        sizes="(max-width: 1024px) 50vw, 280px"
      />
      <div className="p-[13px]">
        <h4 className="mb-1 text-sm font-extrabold text-brand-cream">{product.name}</h4>
        {product.description ? (
          <p className="mb-3 line-clamp-2 text-[11px] leading-snug text-brand-cream/40">
            {product.description}
          </p>
        ) : (
          <div className="mb-3" />
        )}
        <div className="flex items-center justify-between">
          <div className="font-display text-[26px] text-brand-orange">
            {formatMoney(product.price)}
          </div>
          <button
            type="button"
            className="add-to-cart-btn"
            onClick={(event) => {
              event.stopPropagation();
              addProductToCart(product);
            }}
            aria-label={`Agregar ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
