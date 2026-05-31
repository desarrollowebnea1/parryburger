"use client";

import Image from "next/image";
import { formatMoney, PLACEHOLDER_FOOD } from "@/lib/format";
import type { CartLine } from "@/hooks/useCart";
import { usePublicStore } from "@/context/PublicStoreProvider";

type CartItemProps = {
  item: CartLine;
};

export default function CartItemRow({ item }: CartItemProps) {
  const { cart } = usePublicStore();

  return (
    <div className="flex items-center gap-2.5 border-b border-white/[0.05] py-2.5 last:border-b-0">
      <Image
        src={item.imageUrl || PLACEHOLDER_FOOD}
        alt={item.name}
        width={46}
        height={46}
        className="h-[46px] w-[46px] shrink-0 rounded-[7px] object-cover"
      />
      <div className="min-w-0 flex-1">
        <strong className="block text-xs font-extrabold leading-tight">{item.name}</strong>
        <div className="mt-1 flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded bg-brand-gray1 text-[13px] text-brand-cream hover:bg-brand-orange"
            onClick={() => cart.updateQuantity(item.key, item.quantity - 1)}
          >
            −
          </button>
          <span className="min-w-[20px] text-center text-[13px] font-extrabold">
            {item.quantity}
          </span>
          <button
            type="button"
            className="flex h-5 w-5 items-center justify-center rounded bg-brand-gray1 text-[13px] text-brand-cream hover:bg-brand-orange"
            onClick={() => cart.updateQuantity(item.key, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="shrink-0 font-display text-xl text-brand-orange">
        {formatMoney(item.price * item.quantity)}
      </div>
      <button
        type="button"
        className="border-none bg-transparent text-sm text-brand-cream/20 hover:text-[#c0392b]"
        onClick={() => cart.removeItem(item.key)}
        aria-label="Eliminar"
      >
        ✕
      </button>
    </div>
  );
}
