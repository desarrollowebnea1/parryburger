import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug } from "@/lib/admin/slug";
import { syncPromoProducts } from "@/lib/admin/promos";
import { serializeAdminPromo } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import { updatePromoSchema } from "@/lib/validators/promo";

export { dynamic };

type RouteContext = { params: { id: string } };

const promoInclude = {
  products: {
    include: { product: true },
  },
} as const;

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const promo = await prisma.promo.findUnique({
      where: { id: params.id },
      include: promoInclude,
    });

    if (!promo) {
      return jsonError("Promo no encontrada", 404);
    }

    return jsonOk({ promo: serializeAdminPromo(promo) });
  } catch (error) {
    return handleApiError(error, "api/admin/promos/[id] GET");
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.promo.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Promo no encontrada", 404);
    }

    const body = await request.json();
    const parsed = updatePromoSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;

    const slug =
      input.title || input.slug
        ? await ensureUniqueSlug(
            prisma,
            "promo",
            input.title ?? existing.title,
            params.id,
            input.slug,
          )
        : undefined;

    const promo = await prisma.$transaction(async (tx) => {
      await tx.promo.update({
        where: { id: params.id },
        data: {
          ...(input.title !== undefined ? { title: input.title } : {}),
          ...(slug !== undefined ? { slug } : {}),
          ...(input.description !== undefined
            ? { description: input.description }
            : {}),
          ...(input.price !== undefined ? { price: input.price } : {}),
          ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
          ...(input.imagePosition !== undefined
            ? { imagePosition: input.imagePosition ?? "center" }
            : {}),
          ...(input.active !== undefined ? { active: input.active } : {}),
          ...(input.featured !== undefined ? { featured: input.featured } : {}),
          ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
        },
      });

      if (input.productIds !== undefined) {
        await syncPromoProducts(tx, params.id, input.productIds);
      }

      return tx.promo.findUniqueOrThrow({
        where: { id: params.id },
        include: promoInclude,
      });
    });

    return jsonOk({ promo: serializeAdminPromo(promo) });
  } catch (error) {
    if (error instanceof Error && error.message.includes("productos")) {
      return jsonError(error.message, 400);
    }
    return handleApiError(error, "api/admin/promos/[id] PATCH");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.promo.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Promo no encontrada", 404);
    }

    await prisma.promo.delete({ where: { id: params.id } });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error, "api/admin/promos/[id] DELETE");
  }
}
