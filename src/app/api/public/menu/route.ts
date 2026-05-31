import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api/public";
import { serializePublicProduct } from "@/lib/orders/public-order";
import type { PublicCategory } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { active: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    const payload: PublicCategory[] = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: category.sortOrder,
      products: category.products.map(serializePublicProduct),
    }));

    return jsonOk({ categories: payload });
  } catch (error) {
    return handleApiError(error, "api/public/menu");
  }
}
