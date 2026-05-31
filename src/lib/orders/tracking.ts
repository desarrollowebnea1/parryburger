import type { OrderStatus } from "@prisma/client";
import type { OrderTimelineEntry } from "@/types";

export const TRACKING_STATUS_LABELS: Record<OrderStatus, string> = {
  NUEVO: "Pedido recibido",
  PREPARANDO: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const STATUS_FLOW: OrderStatus[] = [
  "NUEVO",
  "PREPARANDO",
  "EN_CAMINO",
  "ENTREGADO",
];

export function buildOrderTimeline(
  status: OrderStatus,
  createdAt: Date,
  updatedAt: Date,
): OrderTimelineEntry[] {
  if (status === "CANCELADO") {
    return [
      {
        status: "NUEVO",
        label: TRACKING_STATUS_LABELS.NUEVO,
        at: createdAt.toISOString(),
        completed: true,
        current: false,
      },
      {
        status: "CANCELADO",
        label: TRACKING_STATUS_LABELS.CANCELADO,
        at: updatedAt.toISOString(),
        completed: true,
        current: true,
      },
    ];
  }

  const currentIndex = STATUS_FLOW.indexOf(status);

  return STATUS_FLOW.map((step, index) => ({
    status: step,
    label: TRACKING_STATUS_LABELS[step],
    at:
      index <= currentIndex
        ? (index === 0 ? createdAt : updatedAt).toISOString()
        : null,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));
}
