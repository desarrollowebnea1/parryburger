import { prisma } from "@/lib/prisma";
import { serializeAdminOrder } from "@/lib/admin/serializers";
import { includedProductsMapFromPromos } from "@/lib/orders/public-order";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import { updateAdminOrderSchema } from "@/lib/validators/admin-order";

export { dynamic };

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return jsonError("Pedido no encontrado", 404);
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

    return jsonOk({ order: serializeAdminOrder(order, promoIncludesMap) });
  } catch (error) {
    return handleApiError(error, "api/admin/orders/[id] GET");
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.order.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Pedido no encontrado", 404);
    }

    const body = await request.json();
    const parsed = updateAdminOrderSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
      include: { items: true },
    });

    return jsonOk({ order: serializeAdminOrder(order) });
  } catch (error) {
    return handleApiError(error, "api/admin/orders/[id] PATCH");
  }
}
