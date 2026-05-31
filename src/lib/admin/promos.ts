import type { Prisma, PrismaClient } from "@prisma/client";

type PromoDb = PrismaClient | Prisma.TransactionClient;

export async function syncPromoProducts(
  prisma: PromoDb,
  promoId: string,
  productIds: string[],
) {
  if (productIds.length) {
    const found = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    if (found.length !== productIds.length) {
      throw new Error("Uno o más productos no existen");
    }
  }

  await prisma.promoProduct.deleteMany({ where: { promoId } });

  if (productIds.length) {
    await prisma.promoProduct.createMany({
      data: productIds.map((productId) => ({ promoId, productId })),
      skipDuplicates: true,
    });
  }
}
