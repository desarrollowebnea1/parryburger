import { prisma } from "@/lib/prisma";
import { decimalToNumber } from "@/lib/api/public";
import { serializePublicProduct } from "@/lib/orders/public-order";
import type {
  PublicCategory,
  PublicOpeningHour,
  PublicPaymentMethod,
  PublicPromo,
  PublicSettings,
} from "@/types";

function parseOpeningHours(value: unknown): PublicOpeningHour[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const row = entry as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        days: String(row.days ?? ""),
        hours: String(row.hours ?? ""),
      };
    });
}

function parsePaymentMethods(value: unknown): PublicPaymentMethod[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => {
      const row = entry as Record<string, unknown>;
      return {
        id: String(row.id ?? ""),
        label: String(row.label ?? ""),
        active: Boolean(row.active),
      };
    })
    .filter((method) => method.active);
}

export async function getPublicSettings(): Promise<PublicSettings | null> {
  const settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });
  if (!settings) return null;

  return {
    businessName: settings.businessName,
    slogan: settings.slogan,
    whatsappNumber: settings.whatsappNumber,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    address: settings.address,
    mapsUrl: settings.mapsUrl,
    mapsEmbedUrl: settings.mapsEmbedUrl,
    deliveryCost: decimalToNumber(settings.deliveryCost),
    heroTag: settings.heroTag,
    heroTitleLine1: settings.heroTitleLine1,
    heroTitleLine2: settings.heroTitleLine2,
    heroTitleLine3: settings.heroTitleLine3,
    heroDescription: settings.heroDescription,
    heroImageUrl: settings.heroImageUrl,
    heroImagePosition: settings.heroImagePosition,
    footerText: settings.footerText,
    openingHours: parseOpeningHours(settings.openingHoursJson),
    paymentMethods: parsePaymentMethods(settings.paymentMethodsJson),
  };
}

export async function getPublicMenu(): Promise<PublicCategory[]> {
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

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sortOrder,
    products: category.products.map(serializePublicProduct),
  }));
}

export async function getPublicPromos(): Promise<PublicPromo[]> {
  const promos = await prisma.promo.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: { include: { product: true } },
    },
  });

  return promos.map((promo) => ({
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
}

export async function getPublicHomeData() {
  const [settings, categories, promos] = await Promise.all([
    getPublicSettings(),
    getPublicMenu(),
    getPublicPromos(),
  ]);

  return { settings, categories, promos };
}
