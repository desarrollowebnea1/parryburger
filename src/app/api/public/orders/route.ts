import { prisma } from "@/lib/prisma";
import { generateOrderCode } from "@/lib/order-code";
import {
  resolveOrderLines,
  roundMoney,
  serializePublicOrder,
} from "@/lib/orders/public-order";
import {
  handleApiError,
  jsonError,
  jsonOk,
  decimalToNumber,
} from "@/lib/api/public";
import { createOrderSchema } from "@/lib/validators/order";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CreateOrderResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Datos inválidos";
      return jsonError(message, 400);
    }

    const input = parsed.data;

    const settings = await prisma.businessSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      return jsonError("Configuración del negocio no encontrada", 503);
    }

    const deliveryCost =
      input.deliveryType === "DELIVERY"
        ? decimalToNumber(settings.deliveryCost)
        : 0;

    const order = await prisma.$transaction(async (tx) => {
      const lines = await resolveOrderLines(tx, input.items);

      if (!lines.length) {
        throw new Error("No se pudieron resolver los ítems del pedido");
      }

      const subtotal = roundMoney(
        lines.reduce((sum, line) => sum + line.subtotal, 0),
      );
      const total = roundMoney(subtotal + deliveryCost);
      const orderCode = await generateOrderCode(tx);

      const whatsappMessage = buildWhatsAppMessage({
        businessName: settings.businessName,
        orderCode,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        deliveryType: input.deliveryType,
        address: input.address,
        zone: input.zone,
        paymentMethod: input.paymentMethod,
        notes: input.notes,
        items: lines,
        subtotal,
        deliveryCost,
        total,
      });

      return tx.order.create({
        data: {
          orderCode,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          deliveryType: input.deliveryType,
          address: input.address ?? null,
          zone: input.zone ?? null,
          paymentMethod: input.paymentMethod,
          notes: input.notes ?? null,
          subtotal,
          deliveryCost,
          total,
          whatsappMessage,
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              promoId: line.promoId,
              name: line.name,
              price: line.price,
              quantity: line.quantity,
              subtotal: line.subtotal,
            })),
          },
        },
        include: { items: true },
      });
    });

    const whatsappUrl = buildWhatsAppUrl(
      settings.whatsappNumber,
      order.whatsappMessage ?? "",
    );

    const payload: CreateOrderResponse = {
      orderCode: order.orderCode,
      whatsappUrl,
      order: serializePublicOrder(order),
    };

    return jsonOk(payload, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.startsWith("Producto no disponible") ||
        error.message.startsWith("Promo no disponible")
      ) {
        return jsonError(error.message, 400);
      }
    }
    return handleApiError(error, "api/public/orders");
  }
}
