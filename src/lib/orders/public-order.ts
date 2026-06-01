import type { Order, OrderItem, Prisma, Product } from "@prisma/client";
import { decimalToNumber } from "@/lib/api/public";
import { getIncludedProductNames } from "@/lib/promo-includes";
import type { PublicOrder, PublicOrderItem, PublicProduct } from "@/types";

export function serializePublicProduct(product: Product): PublicProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: decimalToNumber(product.price),
    imageUrl: product.imageUrl,
    imagePosition: product.imagePosition,
    featured: product.featured,
    sortOrder: product.sortOrder,
  };
}

export function serializePublicOrderItem(item: OrderItem): PublicOrderItem {
  return {
    id: item.id,
    name: item.name,
    price: decimalToNumber(item.price),
    quantity: item.quantity,
    subtotal: decimalToNumber(item.subtotal),
    productId: item.productId,
    promoId: item.promoId,
  };
}

export function serializePublicOrder(
  order: Order & { items: OrderItem[] },
): PublicOrder {
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
    items: order.items.map(serializePublicOrderItem),
    createdAt: order.createdAt.toISOString(),
  };
}

export type ResolvedOrderLine = {
  productId: string | null;
  promoId: string | null;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  includedProductNames?: string[];
};

export async function resolveOrderLines(
  tx: Prisma.TransactionClient,
  items: { productId?: string; promoId?: string; quantity: number }[],
): Promise<ResolvedOrderLine[]> {
  const productIds = items
    .filter((item) => item.productId)
    .map((item) => item.productId!);
  const promoIds = items
    .filter((item) => item.promoId)
    .map((item) => item.promoId!);

  const [products, promos] = await Promise.all([
    productIds.length
      ? tx.product.findMany({
          where: { id: { in: productIds }, active: true },
        })
      : Promise.resolve([]),
    promoIds.length
      ? tx.promo.findMany({
          where: { id: { in: promoIds }, active: true },
          include: {
            products: { include: { product: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const productMap = new Map(products.map((product) => [product.id, product]));
  const promoMap = new Map(promos.map((promo) => [promo.id, promo]));

  const resolved: ResolvedOrderLine[] = [];

  for (const item of items) {
    if (item.productId) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new Error(`Producto no disponible: ${item.productId}`);
      }
      const price = decimalToNumber(product.price);
      resolved.push({
        productId: product.id,
        promoId: null,
        name: product.name,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
      });
      continue;
    }

    if (item.promoId) {
      const promo = promoMap.get(item.promoId);
      if (!promo) {
        throw new Error(`Promo no disponible: ${item.promoId}`);
      }
      const price = decimalToNumber(promo.price);
      const includedProductNames = getIncludedProductNames(
        promo.products
          .map((link) => link.product)
          .filter((product) => product.active),
      );
      resolved.push({
        productId: null,
        promoId: promo.id,
        name: promo.title,
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity,
        includedProductNames:
          includedProductNames.length > 0 ? includedProductNames : undefined,
      });
    }
  }

  return resolved;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

type PromoWithProducts = {
  id: string;
  products: { product: Product }[];
};

export function includedProductsMapFromPromos(
  promos: PromoWithProducts[],
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const promo of promos) {
    const names = getIncludedProductNames(
      promo.products
        .map((link) => link.product)
        .filter((product) => product.active),
    );
    if (names.length) map.set(promo.id, names);
  }
  return map;
}
