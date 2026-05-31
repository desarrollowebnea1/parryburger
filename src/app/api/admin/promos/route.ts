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
import { createPromoSchema } from "@/lib/validators/promo";

export { dynamic };

const promoInclude = {
  products: {
    include: { product: true },
  },
} as const;

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const promos = await prisma.promo.findMany({
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
      include: promoInclude,
    });

    return jsonOk({ promos: promos.map(serializeAdminPromo) });
  } catch (error) {
    return handleApiError(error, "api/admin/promos GET");
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createPromoSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;
    const slug = await ensureUniqueSlug(
      prisma,
      "promo",
      input.title,
      undefined,
      input.slug,
    );

    const promo = await prisma.$transaction(async (tx) => {
      const created = await tx.promo.create({
        data: {
          title: input.title,
          slug,
          description: input.description ?? null,
          price: input.price,
          imageUrl: input.imageUrl ?? null,
          imagePosition: input.imagePosition ?? "center",
          active: input.active ?? true,
          featured: input.featured ?? true,
          sortOrder: input.sortOrder ?? 0,
        },
      });

      if (input.productIds?.length) {
        await syncPromoProducts(tx, created.id, input.productIds);
      }

      return tx.promo.findUniqueOrThrow({
        where: { id: created.id },
        include: promoInclude,
      });
    });

    return jsonOk({ promo: serializeAdminPromo(promo) }, 201);
  } catch (error) {
    if (error instanceof Error && error.message.includes("productos")) {
      return jsonError(error.message, 400);
    }
    return handleApiError(error, "api/admin/promos POST");
  }
}
