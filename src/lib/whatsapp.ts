import type { DeliveryType, OrderStatus } from "@prisma/client";
import { buildWhatsAppChatUrl } from "@/lib/social-links";

export type WhatsAppOrderLine = {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  promoId?: string | null;
  includedProductNames?: string[];
};

export type WhatsAppOrderInput = {
  businessName: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address?: string | null;
  zone?: string | null;
  paymentMethod: string;
  notes?: string | null;
  items: WhatsAppOrderLine[];
  subtotal: number;
  deliveryCost: number;
  total: number;
};

export type CustomerWhatsAppInput = {
  customerName: string;
  orderCode: string;
  total: number;
  status: OrderStatus;
};

function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}

export function buildWhatsAppMessage(input: WhatsAppOrderInput): string {
  const deliveryLabel =
    input.deliveryType === "DELIVERY" ? "Delivery" : "Retiro en local";

  let message = `Hola ${input.businessName}, quiero hacer este pedido:\n\n`;
  message += `*CLIENTE:*\n`;
  message += `Nombre: ${input.customerName}\n`;
  if (input.customerPhone) {
    message += `Teléfono: ${input.customerPhone}\n`;
  }
  message += `Tipo de entrega: ${deliveryLabel}\n`;

  if (input.deliveryType === "DELIVERY") {
    if (input.address) message += `Dirección: ${input.address}\n`;
    if (input.zone) message += `Zona: ${input.zone}\n`;
  }

  message += `\n*PEDIDO:*\n`;
  for (const item of input.items) {
    if (item.promoId) {
      message += `${item.quantity} x Promo: ${item.name} — ${formatMoney(item.price)} - ${formatMoney(item.subtotal)}\n`;
      if (item.includedProductNames?.length) {
        message += `Incluye: ${item.includedProductNames.join(", ")}\n`;
      }
    } else {
      message += `${item.quantity} x ${item.name} - ${formatMoney(item.subtotal)}\n`;
    }
  }

  if (input.notes?.trim()) {
    message += `\n*ACLARACIONES:* ${input.notes.trim()}\n`;
  }

  message += `\n*PAGO:* ${input.paymentMethod}\n`;
  message += `\n*RESUMEN:*\n`;
  message += `Subtotal: ${formatMoney(input.subtotal)}\n`;
  message +=
    input.deliveryType === "DELIVERY"
      ? `Envío: ${formatMoney(input.deliveryCost)}\n`
      : `Envío: Gratis (retiro)\n`;
  message += `*TOTAL: ${formatMoney(input.total)}*\n`;
  message += `\n*CÓDIGO DE PEDIDO:* ${input.orderCode}\n`;
  message += `\n¡Gracias!`;

  return message;
}

export function buildCustomerWhatsAppMessage(input: CustomerWhatsAppInput): string {
  const { customerName, orderCode, total, status } = input;
  const formattedTotal = formatMoney(total);

  switch (status) {
    case "NUEVO":
      return `Hola ${customerName}, recibimos tu pedido ${orderCode}. Total: ${formattedTotal}. Gracias por elegir Parry Burger Express.`;
    case "PREPARANDO":
      return `Hola ${customerName}, tu pedido ${orderCode} ya está en preparación.`;
    case "EN_CAMINO":
      return `Hola ${customerName}, tu pedido ${orderCode} ya está en camino.`;
    case "ENTREGADO":
      return `Hola ${customerName}, tu pedido ${orderCode} figura como entregado. ¡Gracias por elegirnos!`;
    case "CANCELADO":
      return `Hola ${customerName}, necesitamos comunicarnos por tu pedido ${orderCode}. Por favor respondé este mensaje.`;
    default:
      return `Hola ${customerName}, te escribimos desde Parry Burger Express por tu pedido ${orderCode}.`;
  }
}

export function buildOrderInquiryMessage(
  businessName: string,
  orderCode: string,
): string {
  return `Hola ${businessName}, consulto por el estado de mi pedido ${orderCode}.`;
}

export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string,
): string {
  return buildWhatsAppChatUrl(whatsappNumber, message);
}
