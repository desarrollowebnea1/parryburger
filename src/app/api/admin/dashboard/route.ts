import { prisma } from "@/lib/prisma";
import { serializeAdminOrder } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";

export { dynamic };

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      productsCount,
      categoriesCount,
      promosCount,
      ordersToday,
      pendingOrders,
      totalOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.promo.count(),
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({
        where: { status: { in: ["NUEVO", "PREPARANDO", "EN_CAMINO"] } },
      }),
      prisma.order.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { items: true },
      }),
    ]);

    return jsonOk({
      stats: {
        products: productsCount,
        categories: categoriesCount,
        promos: promosCount,
        ordersToday,
        pendingOrders,
        totalOrders,
      },
      recentOrders: recentOrders.map(serializeAdminOrder),
    });
  } catch (error) {
    return handleApiError(error, "api/admin/dashboard");
  }
}
