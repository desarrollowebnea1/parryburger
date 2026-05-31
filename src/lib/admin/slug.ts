import type { PrismaClient } from "@prisma/client";
import { slugify } from "@/lib/slug";

type SlugModel = "product" | "category" | "promo";

async function slugExists(
  prisma: PrismaClient,
  model: SlugModel,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  if (model === "product") {
    const row = await prisma.product.findUnique({ where: { slug } });
    return Boolean(row && row.id !== excludeId);
  }
  if (model === "category") {
    const row = await prisma.category.findUnique({ where: { slug } });
    return Boolean(row && row.id !== excludeId);
  }
  const row = await prisma.promo.findUnique({ where: { slug } });
  return Boolean(row && row.id !== excludeId);
}

export async function ensureUniqueSlug(
  prisma: PrismaClient,
  model: SlugModel,
  name: string,
  excludeId?: string,
  preferredSlug?: string,
): Promise<string> {
  const base = slugify(preferredSlug?.trim() || name);
  if (!base) {
    throw new Error("No se pudo generar un slug válido");
  }

  let candidate = base;
  let suffix = 2;

  while (await slugExists(prisma, model, candidate, excludeId)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}
