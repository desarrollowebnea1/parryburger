"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import AdminMobileCard from "@/components/admin/AdminMobileCard";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
import AdminButton from "@/components/admin/AdminButton";
import { adminFetch } from "@/lib/admin/api-client";
import { formatMoney } from "@/lib/format";
import type { OrderStatus } from "@prisma/client";

type DashboardData = {
  stats: {
    products: number;
    categories: number;
    promos: number;
    ordersToday: number;
    pendingOrders: number;
    totalOrders: number;
  };
  recentOrders: Array<{
    id: string;
    orderCode: string;
    customerName: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Error"));
  }, []);

  if (error) {
    return <p className="text-sm text-brand-orange">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-brand-cream/50">Cargando dashboard...</p>;
  }

  return (
    <div>
      <AdminPageHeader title="Dashboard" />

      <div className="mb-5 grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 lg:grid-cols-3">
        <StatCard label="Productos" value={data.stats.products} />
        <StatCard label="Categorías" value={data.stats.categories} />
        <StatCard label="Promociones" value={data.stats.promos} />
        <StatCard label="Pedidos hoy" value={data.stats.ordersToday} />
        <StatCard label="Pendientes" value={data.stats.pendingOrders} />
        <StatCard label="Total pedidos" value={data.stats.totalOrders} />
      </div>

      <AdminCard title="📋 Últimos pedidos">
        {data.recentOrders.length ? (
          <>
            <ul className="flex flex-col gap-3 md:hidden">
              {data.recentOrders.map((order) => (
                <AdminMobileCard key={order.id}>
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <span className="font-display text-xl text-brand-orange">
                      {order.orderCode}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm font-bold text-brand-cream">{order.customerName}</p>
                  <p className="mt-1 text-sm text-brand-cream/60">
                    {formatMoney(order.total)} ·{" "}
                    {new Date(order.createdAt).toLocaleString("es-AR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  <AdminButton
                    href={`/admin/pedidos/${order.id}`}
                    variant="secondary"
                    className="mt-3 w-full"
                  >
                    Ver pedido
                  </AdminButton>
                </AdminMobileCard>
              ))}
            </ul>

            <div className="hidden overflow-x-auto md:block">
              <table className="admin-table w-full text-left text-sm">
                <thead>
                  <tr className="text-brand-cream/40">
                    <th className="pb-2">Código</th>
                    <th className="pb-2">Cliente</th>
                    <th className="pb-2">Total</th>
                    <th className="pb-2">Estado</th>
                    <th className="pb-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
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
          </>
        ) : (
          <p className="text-sm text-brand-cream/40">Todavía no hay pedidos.</p>
        )}
      </AdminCard>
    </div>
  );
}
