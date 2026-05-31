import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug } from "@/lib/admin/slug";
import { serializeAdminCategory } from "@/lib/admin/serializers";
import {
  dynamic,
  handleApiError,
  jsonError,
  jsonOk,
  requireAdminApi,
} from "@/lib/api/admin";
import {
  createCategorySchema,
} from "@/lib/validators/category";

export { dynamic };

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });

    return jsonOk({
      categories: categories.map(serializeAdminCategory),
    });
  } catch (error) {
    return handleApiError(error, "api/admin/categories GET");
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;
    const slug = await ensureUniqueSlug(
      prisma,
      "category",
      input.name,
      undefined,
      input.slug,
    );

    const category = await prisma.category.create({
      data: {
        name: input.name,
        slug,
        description: input.description ?? null,
        active: input.active ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
      include: { _count: { select: { products: true } } },
    });

    return jsonOk({ category: serializeAdminCategory(category) }, 201);
  } catch (error) {
    return handleApiError(error, "api/admin/categories POST");
  }
}
