"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY } from "@/lib/constants";

export type CartItemType = "product" | "promo";

export type CartLine = {
  key: string;
  type: CartItemType;
  productId?: string;
  promoId?: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  includedProductNames?: string[];
};

type CartStorage = {
  items: CartLine[];
  updatedAt: string;
};

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartStorage;
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartLine[]) {
  const payload: CartStorage = {
    items,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}

export function useCart() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  const addItem = useCallback((line: Omit<CartLine, "key" | "quantity">) => {
    setItems((prev) => {
      const key =
        line.type === "product"
          ? `product:${line.productId}`
          : `promo:${line.promoId}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...line, key, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.key !== key);
      return prev.map((item) =>
        item.key === key ? { ...item, quantity } : item,
      );
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const mergeItems = useCallback((incoming: CartLine[]) => {
    setItems((prev) => {
      const next = [...prev];
      for (const line of incoming) {
        const existing = next.find((item) => item.key === line.key);
        if (existing) {
          const index = next.indexOf(existing);
          next[index] = {
            ...existing,
            name: line.name,
            price: line.price,
            imageUrl: line.imageUrl,
            includedProductNames: line.includedProductNames,
            quantity: existing.quantity + line.quantity,
          };
        } else {
          next.push(line);
        }
      }
      return next;
    });
  }, []);

  return {
    items,
    hydrated,
    itemCount,
    subtotal,
    addItem,
    mergeItems,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
