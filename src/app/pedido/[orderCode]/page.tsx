import type { Metadata } from "next";
import OrderTrackingPage from "@/components/public/OrderTrackingPage";

export const dynamic = "force-dynamic";

type PedidoPageProps = {
  params: { orderCode: string };
};

export function generateMetadata({ params }: PedidoPageProps): Metadata {
  const code = params.orderCode?.trim().toUpperCase() || "";
  return {
    title: code
      ? `Pedido ${code} | Parry Burger Express`
      : "Seguimiento de pedido | Parry Burger Express",
    description: "Consultá el estado de tu pedido en Parry Burger Express.",
  };
}

export default function PedidoPage({ params }: PedidoPageProps) {
  const orderCode = params.orderCode?.trim().toUpperCase() || "";
  return <OrderTrackingPage orderCode={orderCode} />;
}
