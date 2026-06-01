import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeAdminOrder } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import { adminOrdersQuerySchema } from "@/lib/validators/admin-order";

export { dynamic };

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const parsed = adminOrdersQuerySchema.safeParse({
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Filtros inválidos", 400);
    }

    const { status, search, from, to, limit = 50 } = parsed.data;

    const where: Prisma.OrderWhereInput = {};

    if (status) where.status = status;

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    if (search) {
      where.OR = [
        { orderCode: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { items: true },
    });

    return jsonOk({ orders: orders.map((order) => serializeAdminOrder(order)) });
  } catch (error) {
    return handleApiError(error, "api/admin/orders GET");
  }
}
