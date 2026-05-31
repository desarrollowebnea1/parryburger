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
import { updateCategorySchema } from "@/lib/validators/category";

export { dynamic };

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } },
    });

    if (!category) {
      return jsonError("Categoría no encontrada", 404);
    }

    return jsonOk({ category: serializeAdminCategory(category) });
  } catch (error) {
    return handleApiError(error, "api/admin/categories/[id] GET");
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.category.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Categoría no encontrada", 404);
    }

    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;

    const slug =
      input.name || input.slug
        ? await ensureUniqueSlug(
            prisma,
            "category",
            input.name ?? existing.name,
            params.id,
            input.slug,
          )
        : undefined;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
      include: { _count: { select: { products: true } } },
    });

    return jsonOk({ category: serializeAdminCategory(category) });
  } catch (error) {
    return handleApiError(error, "api/admin/categories/[id] PATCH");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } },
    });

    if (!existing) {
      return jsonError("Categoría no encontrada", 404);
    }

    if (existing._count.products > 0) {
      return jsonError(
        "No se puede eliminar una categoría con productos asociados",
        400,
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error, "api/admin/categories/[id] DELETE");
  }
}
