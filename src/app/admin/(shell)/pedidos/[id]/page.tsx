"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import OrderStatusBadge, {
  ORDER_STATUS_LABELS,
} from "@/components/admin/OrderStatusBadge";
import { adminFetch } from "@/lib/admin/api-client";
import { PromoIncludesInline } from "@/components/public/PromoIncludes";
import { formatMoney } from "@/lib/format";
import {
  buildCustomerWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";
import type { OrderStatus } from "@prisma/client";

type OrderDetail = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  address: string | null;
  zone: string | null;
  paymentMethod: string;
  notes: string | null;
  subtotal: number;
  deliveryCost: number;
  total: number;
  status: OrderStatus;
  whatsappMessage: string | null;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
    promoId?: string | null;
    includedProductNames?: string[];
  }>;
  createdAt: string;
};

const STATUSES: OrderStatus[] = [
  "NUEVO",
  "PREPARANDO",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
];

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    adminFetch<{ order: OrderDetail }>(`/api/admin/orders/${params.id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(status: OrderStatus) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await adminFetch(`/api/admin/orders/${params.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setSuccess("Estado actualizado.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!order) {
    return <p className="text-sm text-brand-cream/50">Cargando pedido...</p>;
  }

  const customerMessage = buildCustomerWhatsAppMessage({
    customerName: order.customerName,
    orderCode: order.orderCode,
    total: order.total,
    status: order.status,
  });

  const customerWa = buildWhatsAppUrl(order.customerPhone, customerMessage);

  return (
    <div className="min-w-0">
      <div className="mb-5 space-y-3">
        <Link
          href="/admin/pedidos"
          className="inline-flex min-h-11 items-center text-sm font-bold text-brand-cream/50 hover:text-brand-orange"
        >
          ← Volver a pedidos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="break-all font-display text-2xl tracking-[2px] text-brand-orange sm:text-3xl">
            {order.orderCode}
          </h2>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <AdminAlert type="error" message={error} />
      <AdminAlert type="success" message={success} />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Cliente">
          <div className="space-y-2 break-words text-sm">
            <p>
              <strong className="text-brand-cream">{order.customerName}</strong>
            </p>
            <p>Tel: {order.customerPhone}</p>
            <p>Entrega: {order.deliveryType}</p>
            {order.address ? <p>Dirección: {order.address}</p> : null}
            {order.zone ? <p>Zona: {order.zone}</p> : null}
            <p>Pago: {order.paymentMethod}</p>
            {order.notes ? <p>Notas: {order.notes}</p> : null}
          </div>
          <div className="mt-4">
            <AdminButton
              variant="primary"
              className="w-full"
              onClick={() => window.open(customerWa, "_blank")}
            >
              Enviar WhatsApp al cliente
            </AdminButton>
            <p className="mt-2 text-xs text-brand-cream/40">
              Mensaje según estado: {ORDER_STATUS_LABELS[order.status]}
            </p>
          </div>
        </AdminCard>

        <AdminCard title="Totales">
          <p className="text-sm text-brand-cream/70">
            Subtotal: {formatMoney(order.subtotal)}
            <br />
            Envío: {formatMoney(order.deliveryCost)}
            <br />
            <strong className="text-brand-orange">Total: {formatMoney(order.total)}</strong>
          </p>
          <p className="mt-2 text-xs text-brand-cream/40">
            {new Date(order.createdAt).toLocaleString("es-AR")}
          </p>
        </AdminCard>
      </div>

      <AdminCard title="Productos">
        <ul className="space-y-2 text-sm">
          {order.items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-3 border-b border-brand-gray1/40 py-2"
            >
              <span className="min-w-0 break-words">
                {item.quantity} x {item.name}
                {item.promoId && item.includedProductNames?.length ? (
                  <PromoIncludesInline
                    names={item.includedProductNames}
                    className="mt-0.5 block text-xs text-brand-cream/45"
                  />
                ) : null}
              </span>
              <span className="shrink-0">{formatMoney(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard title="Cambiar estado">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
          {STATUSES.map((status) => (
            <AdminButton
              key={status}
              variant={order.status === status ? "primary" : "secondary"}
              disabled={loading || order.status === status}
              className="w-full"
              onClick={() => updateStatus(status)}
            >
              {ORDER_STATUS_LABELS[status]}
            </AdminButton>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
