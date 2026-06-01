"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminMobileCard from "@/components/admin/AdminMobileCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OrderStatusBadge, {
  ORDER_STATUS_LABELS,
} from "@/components/admin/OrderStatusBadge";
import { adminFetch } from "@/lib/admin/api-client";
import { formatMoney } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

type OrderRow = {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const STATUSES: Array<OrderStatus | ""> = [
  "",
  "NUEVO",
  "PREPARANDO",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search.trim()) params.set("search", search.trim());

    adminFetch<{ orders: OrderRow[] }>(`/api/admin/orders?${params.toString()}`)
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, [status, search]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <AdminPageHeader title="Pedidos" />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
        <select
          className="admin-input w-full sm:min-w-[180px] sm:w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus | "")}
        >
          <option value="">Todos los estados</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s as OrderStatus]}
            </option>
          ))}
        </select>
        <input
          className="admin-input w-full flex-1"
          placeholder="Buscar por código, nombre o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AdminButton type="button" variant="secondary" onClick={load} className="w-full sm:w-auto">
          Buscar
        </AdminButton>
      </div>

      {error ? <p className="mb-4 text-sm text-brand-orange">{error}</p> : null}

      <AdminCard title="Listado de pedidos">
        <ul className="flex flex-col gap-3 md:hidden">
          {orders.map((order) => (
            <AdminMobileCard key={order.id}>
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="break-all font-display text-xl text-brand-orange">
                  {order.orderCode}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm font-bold text-brand-cream">{order.customerName}</p>
              <p className="text-xs text-brand-cream/50">{order.customerPhone}</p>
              <p className="mt-2 text-sm">
                <strong className="text-brand-orange">{formatMoney(order.total)}</strong>
                <span className="text-brand-cream/40">
                  {" "}
                  · {order.deliveryType} ·{" "}
                  {new Date(order.createdAt).toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </p>
              <AdminButton
                href={`/admin/pedidos/${order.id}`}
                variant="primary"
                className="mt-3 w-full"
              >
                Ver pedido
              </AdminButton>
            </AdminMobileCard>
          ))}
          {!orders.length ? (
            <p className="text-sm text-brand-cream/40">No hay pedidos con estos filtros.</p>
          ) : null}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="admin-table w-full text-left text-sm">
            <thead>
              <tr className="text-brand-cream/40">
                <th className="pb-2">Código</th>
                <th className="pb-2">Cliente</th>
                <th className="pb-2">Teléfono</th>
                <th className="pb-2">Entrega</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Estado</th>
                <th className="pb-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-brand-gray1/60">
                  <td className="py-3">
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-bold text-brand-orange hover:underline"
                    >
                      {order.orderCode}
                    </Link>
                  </td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">{order.customerPhone}</td>
                  <td className="py-3">{order.deliveryType}</td>
                  <td className="py-3">{formatMoney(order.total)}</td>
                  <td className="py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-brand-cream/50">
                    {new Date(order.createdAt).toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
