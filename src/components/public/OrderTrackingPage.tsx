"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import OrderTimeline from "@/components/public/OrderTimeline";
import { PromoIncludesInline } from "@/components/public/PromoIncludes";
import { formatMoney } from "@/lib/format";
import {
  buildOrderInquiryMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import type { PublicOrderTracking } from "@/types";

type OrderTrackingPageProps = {
  orderCode: string;
};

const DELIVERY_LABELS = {
  RETIRO: "Retiro en local",
  DELIVERY: "Delivery",
} as const;

export default function OrderTrackingPage({ orderCode }: OrderTrackingPageProps) {
  const [tracking, setTracking] = useState<PublicOrderTracking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTracking = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/public/orders/${encodeURIComponent(orderCode)}`,
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Pedido no encontrado");
        setTracking(null);
        return;
      }

      setError("");
      setTracking(data as PublicOrderTracking);
    } catch {
      setError("No se pudo cargar el pedido. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [orderCode]);

  useEffect(() => {
    fetchTracking();
    const interval = window.setInterval(fetchTracking, 30000);
    return () => window.clearInterval(interval);
  }, [fetchTracking]);

  const whatsappUrl =
    tracking &&
    buildWhatsAppUrl(
      tracking.whatsappNumber,
      buildOrderInquiryMessage(tracking.businessName, tracking.orderCode),
    );

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-cream">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-brand-cream/40 transition-colors hover:text-brand-orange"
        >
          ← Volver al menú
        </Link>

        <div className="mb-6 text-center">
          <p className="font-cond text-xs font-black uppercase tracking-[3px] text-brand-orange">
            Parry Burger Express
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-[2px] text-brand-cream">
            Seguimiento de pedido
          </h1>
        </div>

        {loading ? (
          <div className="rounded-brand border border-brand-gray1 bg-brand-black2 p-8 text-center text-sm text-brand-cream/50">
            Cargando pedido...
          </div>
        ) : error ? (
          <div className="rounded-brand border border-[#c0392b]/40 bg-[#c0392b]/10 p-8 text-center">
            <p className="mb-4 text-sm text-brand-cream/70">{error}</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-black text-white no-underline"
            >
              Volver al inicio
            </Link>
          </div>
        ) : tracking ? (
          <div className="space-y-4">
            <section className="rounded-brand border border-brand-gray1 bg-brand-black2 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
                Código de pedido
              </p>
              <p className="font-display text-3xl tracking-wide text-brand-orange">
                {tracking.orderCode}
              </p>
              <p className="mt-2 text-sm text-brand-cream/55">
                {new Date(tracking.createdAt).toLocaleString("es-AR", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </section>

            <section className="rounded-brand border border-brand-gray1 bg-brand-black2 p-5">
              <p className="mb-4 font-cond text-sm font-black uppercase tracking-[2px] text-brand-cream/40">
                Estado del pedido
              </p>
              <OrderTimeline timeline={tracking.timeline} />
            </section>

            <section className="rounded-brand border border-brand-gray1 bg-brand-black2 p-5">
              <p className="mb-3 font-cond text-sm font-black uppercase tracking-[2px] text-brand-cream/40">
                Detalle
              </p>
              <ul className="space-y-2 text-sm">
                {tracking.items.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="flex justify-between border-b border-brand-gray1/50 py-2 last:border-none"
                  >
                    <span className="min-w-0">
                      {item.quantity} x {item.name}
                      {item.promoId && item.includedProductNames?.length ? (
                        <PromoIncludesInline
                          names={item.includedProductNames}
                          className="mt-0.5 block text-xs text-brand-cream/40"
                        />
                      ) : null}
                    </span>
                    <span className="text-brand-cream/70">
                      {formatMoney(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-1.5 border-t border-brand-gray1 pt-4 text-sm text-brand-cream/60">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(tracking.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {tracking.deliveryType === "DELIVERY"
                      ? formatMoney(tracking.deliveryCost)
                      : "Gratis (retiro)"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-brand-cream">
                  <span>Total</span>
                  <span className="text-brand-orange">
                    {formatMoney(tracking.total)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-brand border border-brand-gray1 bg-brand-black2 p-5 text-sm text-brand-cream/70">
              <p>
                <strong className="text-brand-cream">Entrega:</strong>{" "}
                {DELIVERY_LABELS[tracking.deliveryType]}
              </p>
              {tracking.deliveryType === "DELIVERY" && tracking.address ? (
                <p className="mt-1">
                  <strong className="text-brand-cream">Dirección:</strong>{" "}
                  {tracking.address}
                  {tracking.zone ? ` (${tracking.zone})` : ""}
                </p>
              ) : null}
              <p className="mt-1">
                <strong className="text-brand-cream">Pago:</strong>{" "}
                {tracking.paymentMethod}
              </p>
              {tracking.notes ? (
                <p className="mt-1">
                  <strong className="text-brand-cream">Aclaraciones:</strong>{" "}
                  {tracking.notes}
                </p>
              ) : null}
            </section>

            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-send-btn block text-center no-underline"
              >
                Consultar por WhatsApp
              </a>
            ) : null}

            <p className="text-center text-[11px] text-brand-cream/30">
              El estado se actualiza automáticamente cada 30 segundos.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
