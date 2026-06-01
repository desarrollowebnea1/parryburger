import { prisma } from "@/lib/prisma";
import {
  decimalToNumber,
  handleApiError,
  jsonError,
  jsonOk,
} from "@/lib/api/public";
import { buildOrderTimeline } from "@/lib/orders/tracking";
import { normalizeWhatsAppDigits } from "@/lib/social-links";
import { includedProductsMapFromPromos } from "@/lib/orders/public-order";
import type { PublicOrderTracking } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { orderCode: string } },
) {
  try {
    const orderCode = params.orderCode?.trim().toUpperCase();

    if (!orderCode) {
      return jsonError("Código de pedido inválido", 400);
    }

    const [order, settings] = await Promise.all([
      prisma.order.findUnique({
        where: { orderCode },
        select: {
          orderCode: true,
          status: true,
          deliveryType: true,
          paymentMethod: true,
          address: true,
          zone: true,
          notes: true,
          subtotal: true,
          deliveryCost: true,
          total: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              name: true,
              quantity: true,
              subtotal: true,
              productId: true,
              promoId: true,
            },
            orderBy: { name: "asc" },
          },
        },
      }),
      prisma.businessSettings.findUnique({
        where: { id: "default" },
        select: {
          businessName: true,
          whatsappNumber: true,
        },
      }),
    ]);

    if (!order) {
      return jsonError("Pedido no encontrado", 404);
    }

    if (!settings) {
      return jsonError("Configuración del negocio no encontrada", 503);
    }

    const promoIds = order.items
      .map((item) => item.promoId)
      .filter((id): id is string => Boolean(id));

    const promos = promoIds.length
      ? await prisma.promo.findMany({
          where: { id: { in: promoIds } },
          include: { products: { include: { product: true } } },
        })
      : [];

    const promoIncludesMap = includedProductsMapFromPromos(promos);

    const payload: PublicOrderTracking = {
      orderCode: order.orderCode,
      status: order.status,
      deliveryType: order.deliveryType,
      paymentMethod: order.paymentMethod,
      address: order.address,
      zone: order.zone,
      notes: order.notes,
      subtotal: decimalToNumber(order.subtotal),
      deliveryCost: decimalToNumber(order.deliveryCost),
      total: decimalToNumber(order.total),
      items: order.items.map((item) => {
        const includedProductNames = item.promoId
          ? promoIncludesMap.get(item.promoId)
          : undefined;
        return {
          name: item.name,
          quantity: item.quantity,
          subtotal: decimalToNumber(item.subtotal),
          productId: item.productId,
          promoId: item.promoId,
          includedProductNames:
            includedProductNames && includedProductNames.length > 0
              ? includedProductNames
              : undefined,
        };
      }),
      businessName: settings.businessName,
      whatsappNumber: normalizeWhatsAppDigits(settings.whatsappNumber),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      timeline: buildOrderTimeline(
        order.status,
        order.createdAt,
        order.updatedAt,
      ),
    };

    return jsonOk(payload);
  } catch (error) {
    return handleApiError(error, "api/public/orders/[orderCode]");
  }
}
