import type { CartLine } from "@/hooks/useCart";
import { getIncludedProductNames } from "@/lib/promo-includes";
import type {
  PublicCategory,
  PublicOrderTrackingItem,
  PublicPromo,
} from "@/types";

export type RepeatOrderResult = {
  lines: CartLine[];
  unavailableCount: number;
  addedCount: number;
};

export function resolveRepeatOrderItems(
  orderItems: PublicOrderTrackingItem[],
  categories: PublicCategory[],
  promos: PublicPromo[],
): RepeatOrderResult {
  const productMap = new Map<
    string,
    { name: string; price: number; imageUrl: string | null }
  >();
  for (const category of categories) {
    for (const product of category.products) {
      productMap.set(product.id, {
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
  }

  const promoMap = new Map<
    string,
    {
      name: string;
      price: number;
      imageUrl: string | null;
      includedProductNames?: string[];
    }
  >();
  for (const promo of promos) {
    const includedProductNames = getIncludedProductNames(promo.products);
    promoMap.set(promo.id, {
      name: promo.title,
      price: promo.price,
      imageUrl: promo.imageUrl,
      includedProductNames: includedProductNames.length
        ? includedProductNames
        : undefined,
    });
  }

  const lines: CartLine[] = [];
  let unavailableCount = 0;

  for (const item of orderItems) {
    if (item.productId) {
      const product = productMap.get(item.productId);
      if (!product) {
        unavailableCount += 1;
        continue;
      }
      lines.push({
        key: `product:${item.productId}`,
        type: "product",
        productId: item.productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: item.quantity,
      });
      continue;
    }

    if (item.promoId) {
      const promo = promoMap.get(item.promoId);
      if (!promo) {
        unavailableCount += 1;
        continue;
      }
      const includedProductNames =
        item.includedProductNames ?? promo.includedProductNames;
      lines.push({
        key: `promo:${item.promoId}`,
        type: "promo",
        promoId: item.promoId,
        name: promo.name,
        price: promo.price,
        imageUrl: promo.imageUrl,
        includedProductNames,
        quantity: item.quantity,
      });
      continue;
    }

    unavailableCount += 1;
  }

  return {
    lines,
    unavailableCount,
    addedCount: lines.length,
  };
}
