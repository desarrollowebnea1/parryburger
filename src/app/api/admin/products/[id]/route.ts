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
import { updateProductSchema } from "@/lib/validators/product";

export { dynamic };

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!product) {
      return jsonError("Producto no encontrado", 404);
    }

    return jsonOk({ product: serializeAdminProduct(product) });
  } catch (error) {
    return handleApiError(error, "api/admin/products/[id] GET");
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Producto no encontrado", 404);
    }

    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos", 400);
    }

    const input = parsed.data;

    if (input.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        return jsonError("Categoría no encontrada", 404);
      }
    }

    const slug =
      input.name || input.slug
        ? await ensureUniqueSlug(
            prisma,
            "product",
            input.name ?? existing.name,
            params.id,
            input.slug,
          )
        : undefined;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.categoryId !== undefined
          ? { categoryId: input.categoryId }
          : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        ...(input.imagePosition !== undefined
          ? { imagePosition: input.imagePosition ?? "center" }
          : {}),
        ...(input.active !== undefined ? { active: input.active } : {}),
        ...(input.featured !== undefined ? { featured: input.featured } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      },
      include: { category: true },
    });

    return jsonOk({ product: serializeAdminProduct(product) });
  } catch (error) {
    return handleApiError(error, "api/admin/products/[id] PATCH");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return jsonError("Producto no encontrado", 404);
    }

    await prisma.product.delete({ where: { id: params.id } });

    return jsonOk({ ok: true });
  } catch (error) {
    return handleApiError(error, "api/admin/products/[id] DELETE");
  }
}
