import { prisma } from "@/lib/prisma";
import {
  decimalToNumber,
  handleApiError,
  jsonOk,
} from "@/lib/api/public";
import { serializePublicProduct } from "@/lib/orders/public-order";
import type { PublicPromo } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const promos = await prisma.promo.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    const payload: PublicPromo[] = promos.map((promo) => ({
      id: promo.id,
      title: promo.title,
      slug: promo.slug,
      description: promo.description,
      price: decimalToNumber(promo.price),
      imageUrl: promo.imageUrl,
      imagePosition: promo.imagePosition,
      featured: promo.featured,
      sortOrder: promo.sortOrder,
      products: promo.products
        .map((link) => link.product)
        .filter((product) => product.active)
        .map(serializePublicProduct),
    }));

    return jsonOk({ promos: payload });
  } catch (error) {
    return handleApiError(error, "api/public/promos");
  }
}
