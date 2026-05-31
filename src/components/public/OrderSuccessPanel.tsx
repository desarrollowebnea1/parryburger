"use client";

import Link from "next/link";

type OrderSuccessPanelProps = {
  orderCode: string;
  variant?: "sidebar" | "drawer";
};

export default function OrderSuccessPanel({
  orderCode,
  variant = "sidebar",
}: OrderSuccessPanelProps) {
  const trackingHref = `/pedido/${encodeURIComponent(orderCode)}`;

  return (
    <div
      className={
        variant === "drawer"
          ? "mt-4 rounded-brand border border-brand-orange/40 bg-brand-black3 p-4"
          : "rounded-brand border border-brand-orange/40 bg-brand-black3 p-[18px]"
      }
    >
      <div className="mb-2 text-center text-3xl">✅</div>
      <h4 className="mb-2 text-center font-cond text-base font-black uppercase tracking-[2px] text-brand-orange">
        Pedido registrado
      </h4>
      <p className="mb-3 text-center text-[13px] leading-relaxed text-brand-cream/60">
        Tu pedido fue guardado. Confirmá el envío por WhatsApp con el local.
      </p>
      <div className="mb-4 rounded-lg border border-brand-gray1 bg-brand-black2 px-4 py-3 text-center">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
          Código de pedido
        </span>
        <strong className="font-display text-2xl tracking-wide text-brand-cream">
          {orderCode}
        </strong>
      </div>
      <Link href={trackingHref} className="wa-send-btn block text-center no-underline">
        Ver estado del pedido
      </Link>
      <p className="mt-3 text-center text-[11px] text-brand-cream/30">
        Guardá este código para consultar el seguimiento cuando quieras.
      </p>
    </div>
  );
}
