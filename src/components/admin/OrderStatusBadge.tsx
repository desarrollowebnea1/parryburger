import type { OrderStatus } from "@prisma/client";

const LABELS: Record<OrderStatus, string> = {
  NUEVO: "Nuevo",
  PREPARANDO: "Preparando",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const COLORS: Record<OrderStatus, string> = {
  NUEVO: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  PREPARANDO: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30",
  EN_CAMINO: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  ENTREGADO: "bg-whatsapp/15 text-whatsapp border-whatsapp/30",
  CANCELADO: "bg-[#c0392b]/15 text-[#c0392b] border-[#c0392b]/30",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${COLORS[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}

export { LABELS as ORDER_STATUS_LABELS };
