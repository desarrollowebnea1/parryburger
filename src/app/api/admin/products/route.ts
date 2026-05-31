import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug } from "@/lib/admin/slug";
import { serializeAdminProduct } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import {
  createProductSchema,
} from "@/lib/validators/product";

export { dynamic };

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const products = await prisma.product.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { category: true },
    });

    return jsonOk({ products: products.map(serializeAdminProduct) });
  } catch (error) {
    return handleApiError(error, "api/admin/products GET");
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });
    if (!category) {
      return jsonError("Categoría no encontrada", 404);
    }

    const slug = await ensureUniqueSlug(
      prisma,
      "product",
      input.name,
      undefined,
      input.slug,
    );

    const product = await prisma.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description ?? null,
        price: input.price,
        categoryId: input.categoryId,
        imageUrl: input.imageUrl ?? null,
        imagePosition: input.imagePosition ?? "center",
        active: input.active ?? true,
        featured: input.featured ?? false,
        sortOrder: input.sortOrder ?? 0,
      },
      include: { category: true },
    });

    return jsonOk({ product: serializeAdminProduct(product) }, 201);
  } catch (error) {
    return handleApiError(error, "api/admin/products POST");
  }
}
