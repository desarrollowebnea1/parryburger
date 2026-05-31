"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminAlert from "@/components/admin/AdminAlert";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import OrderStatusBadge, {
  ORDER_STATUS_LABELS,
} from "@/components/admin/OrderStatusBadge";
import { adminFetch } from "@/lib/admin/api-client";
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

  function load() {
    adminFetch<{ order: OrderDetail }>(`/api/admin/orders/${params.id}`)
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }

  useEffect(() => {
    load();
  }, [params.id]);

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
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/pedidos" className="text-xs text-brand-cream/40 hover:text-brand-orange">
            ← Volver a pedidos
          </Link>
          <h2 className="mt-2 font-display text-3xl tracking-[2px] text-brand-orange">
            {order.orderCode}
          </h2>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <AdminAlert type="error" message={error} />
      <AdminAlert type="success" message={success} />

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <AdminCard title="Cliente">
          <p className="text-sm">
            <strong>{order.customerName}</strong>
            <br />
            Tel: {order.customerPhone}
            <br />
            Entrega: {order.deliveryType}
            {order.address ? (
              <>
                <br />
                Dirección: {order.address}
              </>
            ) : null}
            {order.zone ? (
              <>
                <br />
                Zona: {order.zone}
              </>
            ) : null}
            <br />
            Pago: {order.paymentMethod}
            {order.notes ? (
              <>
                <br />
                Notas: {order.notes}
              </>
            ) : null}
          </p>
          <div className="mt-4">
            <AdminButton
              variant="primary"
              onClick={() => window.open(customerWa, "_blank")}
            >
              Enviar WhatsApp al cliente
            </AdminButton>
            <p className="mt-2 text-xs text-brand-cream/40">
              Mensaje según estado actual: {ORDER_STATUS_LABELS[order.status]}
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

      <AdminCard title="Productos" >
        <ul className="space-y-2 text-sm">
          {order.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex justify-between border-b border-brand-gray1/40 py-2">
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>{formatMoney(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard title="Cambiar estado" >
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <AdminButton
              key={status}
              variant={order.status === status ? "primary" : "secondary"}
              disabled={loading || order.status === status}
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
