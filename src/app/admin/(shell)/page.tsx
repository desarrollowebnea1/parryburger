"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminCard from "@/components/admin/AdminCard";
import StatCard from "@/components/admin/StatCard";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";
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
      <h2 className="mb-6 font-display text-3xl tracking-[2px] text-brand-orange">
        Dashboard
      </h2>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Productos" value={data.stats.products} />
        <StatCard label="Categorías" value={data.stats.categories} />
        <StatCard label="Promociones" value={data.stats.promos} />
        <StatCard label="Pedidos hoy" value={data.stats.ordersToday} />
        <StatCard label="Pendientes" value={data.stats.pendingOrders} />
        <StatCard label="Total pedidos" value={data.stats.totalOrders} />
      </div>

      <AdminCard title="📋 Últimos pedidos">
        {data.recentOrders.length ? (
          <div className="overflow-x-auto">
            <table className="admin-table w-full min-w-[640px] text-left text-sm">
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
        ) : (
          <p className="text-sm text-brand-cream/40">Todavía no hay pedidos.</p>
        )}
      </AdminCard>
    </div>
  );
}
