import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  SEED_ADMIN,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_PROMOS,
  SEED_SETTINGS,
} from "./seed/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Parry Burger Express...\n");

  const passwordHash = await bcrypt.hash(SEED_ADMIN.password, 12);

  await prisma.user.upsert({
    where: { email: SEED_ADMIN.email },
    update: {
      name: SEED_ADMIN.name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: SEED_ADMIN.email,
      name: SEED_ADMIN.name,
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log(`✓ Admin: ${SEED_ADMIN.email}`);

  await prisma.businessSettings.upsert({
    where: { id: "default" },
    update: {
      ...SEED_SETTINGS,
      openingHoursJson: SEED_SETTINGS.openingHoursJson,
      paymentMethodsJson: SEED_SETTINGS.paymentMethodsJson,
    },
    create: {
      id: "default",
      ...SEED_SETTINGS,
      openingHoursJson: SEED_SETTINGS.openingHoursJson,
      paymentMethodsJson: SEED_SETTINGS.paymentMethodsJson,
    },
  });
  console.log("✓ BusinessSettings");

  const categoryIdBySlug = new Map<string, string>();

  for (const category of SEED_CATEGORIES) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        active: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
        active: true,
      },
    });
    categoryIdBySlug.set(category.slug, record.id);
  }
  console.log(`✓ ${SEED_CATEGORIES.length} categorías`);

  const productIdByLegacyId = new Map<string, string>();

  for (const product of SEED_PRODUCTS) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Categoría no encontrada: ${product.categorySlug}`);
    }

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId,
        sortOrder: product.sortOrder,
        featured: product.featured,
        active: true,
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        categoryId,
        sortOrder: product.sortOrder,
        featured: product.featured,
        active: true,
      },
    });
    productIdByLegacyId.set(product.legacyId, record.id);
  }
  console.log(`✓ ${SEED_PRODUCTS.length} productos`);

  for (const promo of SEED_PROMOS) {
    const promoRecord = await prisma.promo.upsert({
      where: { slug: promo.slug },
      update: {
        title: promo.title,
        description: promo.description,
        price: promo.price,
        imageUrl: promo.imageUrl,
        sortOrder: promo.sortOrder,
        featured: true,
        active: true,
      },
      create: {
        title: promo.title,
        slug: promo.slug,
        description: promo.description,
        price: promo.price,
        imageUrl: promo.imageUrl,
        sortOrder: promo.sortOrder,
        featured: true,
        active: true,
      },
    });

    await prisma.promoProduct.deleteMany({
      where: { promoId: promoRecord.id },
    });

    for (const legacyProductId of promo.productLegacyIds) {
      const productId = productIdByLegacyId.get(legacyProductId);
      if (!productId) continue;

      await prisma.promoProduct.create({
        data: {
          promoId: promoRecord.id,
          productId,
        },
      });
    }
  }
  console.log(`✓ ${SEED_PROMOS.length} promos`);

  console.log("\n✅ Seed completado.");
}

main()
  .catch((error) => {
    console.error("❌ Seed falló:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
