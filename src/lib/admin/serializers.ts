import type {
  Category,
  Order,
  OrderItem,
  Product,
  Promo,
  BusinessSettings,
} from "@prisma/client";
import { decimalToNumber } from "@/lib/api/public";
import { normalizeWhatsAppDigits } from "@/lib/social-links";

export function serializeAdminProduct(
  product: Product & { category?: Category | null },
) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: decimalToNumber(product.price),
    imageUrl: product.imageUrl,
    imagePosition: product.imagePosition,
    active: product.active,
    featured: product.featured,
    sortOrder: product.sortOrder,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
        }
      : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function serializeAdminCategory(category: Category & { _count?: { products: number } }) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    active: category.active,
    sortOrder: category.sortOrder,
    productCount: category._count?.products ?? 0,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

export function serializeAdminPromo(
  promo: Promo & {
    products?: { product: Product }[];
  },
) {
  return {
    id: promo.id,
    title: promo.title,
    slug: promo.slug,
    description: promo.description,
    price: decimalToNumber(promo.price),
    imageUrl: promo.imageUrl,
    imagePosition: promo.imagePosition,
    active: promo.active,
    featured: promo.featured,
    sortOrder: promo.sortOrder,
    productIds: promo.products?.map((link) => link.product.id) ?? [],
    products:
      promo.products?.map((link) => ({
        id: link.product.id,
        name: link.product.name,
        slug: link.product.slug,
      })) ?? [],
    createdAt: promo.createdAt.toISOString(),
    updatedAt: promo.updatedAt.toISOString(),
  };
}

export function serializeAdminOrderItem(
  item: OrderItem,
  includedProductNames?: string[],
) {
  return {
    id: item.id,
    name: item.name,
    price: decimalToNumber(item.price),
    quantity: item.quantity,
    subtotal: decimalToNumber(item.subtotal),
    productId: item.productId,
    promoId: item.promoId,
    includedProductNames:
      includedProductNames && includedProductNames.length > 0
        ? includedProductNames
        : undefined,
  };
}

export function serializeAdminOrder(
  order: Order & { items?: OrderItem[] },
  promoIncludesMap?: Map<string, string[]>,
) {
  return {
    id: order.id,
    orderCode: order.orderCode,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryType: order.deliveryType,
    address: order.address,
    zone: order.zone,
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    subtotal: decimalToNumber(order.subtotal),
    deliveryCost: decimalToNumber(order.deliveryCost),
    total: decimalToNumber(order.total),
    status: order.status,
    whatsappMessage: order.whatsappMessage,
    items:
      order.items?.map((item) =>
        serializeAdminOrderItem(
          item,
          item.promoId ? promoIncludesMap?.get(item.promoId) : undefined,
        ),
      ) ?? [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

export function serializeAdminSettings(settings: BusinessSettings) {
  return {
    id: settings.id,
    businessName: settings.businessName,
    slogan: settings.slogan,
    whatsappNumber: normalizeWhatsAppDigits(settings.whatsappNumber),
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
    openingHoursJson: settings.openingHoursJson,
    paymentMethodsJson: settings.paymentMethodsJson,
    createdAt: settings.createdAt.toISOString(),
    updatedAt: settings.updatedAt.toISOString(),
  };
}
