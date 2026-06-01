"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCart, type CartLine } from "@/hooks/useCart";
import {
  addOrderToHistory,
  buildOrderSummary,
  getLastOrder,
  getOrderHistory,
  saveOrderHistory,
  updateOrderInHistory,
  type StoredOrderHistoryEntry,
} from "@/lib/order-tracking-storage";
import { getIncludedProductNames } from "@/lib/promo-includes";
import { resolveRepeatOrderItems } from "@/lib/repeat-order";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  PublicCategory,
  PublicOrderTracking,
  PublicProduct,
  PublicPromo,
  PublicSettings,
} from "@/types";
import type { CreateOrderResponse } from "@/types";

export type ModalItem =
  | { type: "product"; product: PublicProduct; categoryName: string }
  | { type: "promo"; promo: PublicPromo };

type PublicStoreContextValue = {
  settings: PublicSettings;
  categories: PublicCategory[];
  promos: PublicPromo[];
  cart: ReturnType<typeof useCart>;
  modalItem: ModalItem | null;
  openModal: (item: ModalItem) => void;
  closeModal: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toast: string | null;
  showToast: (message: string) => void;
  deliveryType: "RETIRO" | "DELIVERY";
  setDeliveryType: (type: "RETIRO" | "DELIVERY") => void;
  activeOrderCode: string | null;
  tracking: PublicOrderTracking | null;
  orderHistory: StoredOrderHistoryEntry[];
  refreshOrderHistory: () => Promise<void>;
  repeatOrder: (orderCode: string) => Promise<{ ok: boolean }>;
  submitOrder: (
    form: OrderFormData,
  ) => Promise<
    | { ok: true; orderCode: string }
    | { ok: false; error: string }
  >;
  addProductToCart: (product: PublicProduct, imageUrl?: string | null) => void;
  addPromoToCart: (promo: PublicPromo) => void;
  openWhatsAppDirect: () => void;
};

export type OrderFormData = {
  customerName: string;
  customerPhone: string;
  address?: string;
  zone?: string;
  paymentMethod: string;
  notes?: string;
};

const PublicStoreContext = createContext<PublicStoreContextValue | null>(null);

export function usePublicStore() {
  const ctx = useContext(PublicStoreContext);
  if (!ctx) {
    throw new Error("usePublicStore must be used within PublicStoreProvider");
  }
  return ctx;
}

type PublicStoreProviderProps = {
  settings: PublicSettings;
  categories: PublicCategory[];
  promos: PublicPromo[];
  children: ReactNode;
};

export function PublicStoreProvider({
  settings,
  categories,
  promos,
  children,
}: PublicStoreProviderProps) {
  const cart = useCart();
  const [modalItem, setModalItem] = useState<ModalItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"RETIRO" | "DELIVERY">("RETIRO");
  const [activeOrderCode, setActiveOrderCode] = useState<string | null>(null);
  const [tracking, setTracking] = useState<PublicOrderTracking | null>(null);
  const [orderHistory, setOrderHistory] = useState<StoredOrderHistoryEntry[]>([]);

  useEffect(() => {
    const last = getLastOrder();
    if (last) {
      setActiveOrderCode(last.orderCode);
    }
    setOrderHistory(getOrderHistory());
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  }, []);

  const refreshOrderHistory = useCallback(async () => {
    const history = getOrderHistory();
    if (!history.length) {
      setOrderHistory([]);
      return;
    }

    const refreshed = await Promise.all(
      history.map(async (entry) => {
        try {
          const response = await fetch(
            `/api/public/orders/${encodeURIComponent(entry.orderCode)}`,
          );
          if (!response.ok) return entry;
          const data = (await response.json()) as PublicOrderTracking;
          return {
            ...entry,
            status: data.status,
            total: data.total,
            createdAt: data.createdAt,
            summary: buildOrderSummary(data.items),
          };
        } catch {
          return entry;
        }
      }),
    );

    setOrderHistory(saveOrderHistory(refreshed));
  }, []);

  const addProductToCart = useCallback(
    (product: PublicProduct, imageUrl?: string | null) => {
      cart.addItem({
        type: "product",
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: imageUrl ?? product.imageUrl,
      });
      showToast("✅ Agregado al carrito");
    },
    [cart, showToast],
  );

  const addPromoToCart = useCallback(
    (promo: PublicPromo) => {
      const includedProductNames = getIncludedProductNames(promo.products);
      cart.addItem({
        type: "promo",
        promoId: promo.id,
        name: promo.title,
        price: promo.price,
        imageUrl: promo.imageUrl,
        includedProductNames: includedProductNames.length
          ? includedProductNames
          : undefined,
      });
      showToast("✅ Agregado al carrito");
    },
    [cart, showToast],
  );

  const openWhatsAppDirect = useCallback(() => {
    const message = `Hola ${settings.businessName}, quiero hacer un pedido 🍔`;
    const url = buildWhatsAppUrl(settings.whatsappNumber, message);
    window.open(url, "_blank");
  }, [settings]);

  const repeatOrder = useCallback(
    async (orderCode: string) => {
      try {
        const response = await fetch(
          `/api/public/orders/${encodeURIComponent(orderCode)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          showToast(data.error || "No se pudo cargar el pedido");
          return { ok: false };
        }

        const order = data as PublicOrderTracking;
        const result = resolveRepeatOrderItems(order.items, categories, promos);

        if (!result.lines.length) {
          showToast("Algunos productos ya no están disponibles.");
          return { ok: false };
        }

        cart.mergeItems(result.lines);
        setDrawerOpen(true);

        if (result.unavailableCount > 0) {
          showToast("Algunos productos ya no están disponibles.");
        } else {
          showToast("Pedido cargado en el carrito");
        }

        return { ok: true };
      } catch {
        showToast("Error al repetir el pedido");
        return { ok: false };
      }
    },
    [cart, categories, promos, showToast],
  );

  const submitOrder = useCallback(
    async (form: OrderFormData) => {
      if (!cart.items.length) {
        return { ok: false as const, error: "Tu carrito está vacío." };
      }

      try {
        const response = await fetch("/api/public/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: form.customerName,
            customerPhone: form.customerPhone,
            deliveryType,
            address: form.address,
            zone: form.zone,
            paymentMethod: form.paymentMethod,
            notes: form.notes,
            items: cart.items.map((item: CartLine) => ({
              productId: item.type === "product" ? item.productId : undefined,
              promoId: item.type === "promo" ? item.promoId : undefined,
              quantity: item.quantity,
            })),
          }),
        });

        const data = (await response.json()) as CreateOrderResponse & {
          error?: string;
        };

        if (!response.ok) {
          return {
            ok: false as const,
            error: data.error || "No se pudo enviar el pedido",
          };
        }

        window.open(data.whatsappUrl, "_blank");
        setActiveOrderCode(data.orderCode);

        const historyEntry: StoredOrderHistoryEntry = {
          orderCode: data.orderCode,
          createdAt: data.order.createdAt,
          total: data.order.total,
          status: data.order.status,
          customerName: data.order.customerName,
          summary: buildOrderSummary(data.order.items),
        };
        const nextHistory = addOrderToHistory(historyEntry);
        setOrderHistory(nextHistory);

        cart.clearCart();
        setDrawerOpen(true);
        showToast(`Pedido ${data.orderCode} registrado`);

        return { ok: true as const, orderCode: data.orderCode };
      } catch {
        return { ok: false as const, error: "Error de conexión. Intentá de nuevo." };
      }
    },
    [cart, deliveryType, showToast],
  );

  useEffect(() => {
    if (!activeOrderCode) {
      setTracking(null);
      return;
    }

    let cancelled = false;

    async function fetchTracking() {
      try {
        const response = await fetch(
          `/api/public/orders/${encodeURIComponent(activeOrderCode!)}`,
        );
        if (!response.ok) return;
        const data = (await response.json()) as PublicOrderTracking;
        if (!cancelled) {
          setTracking(data);
          const next = updateOrderInHistory(activeOrderCode!, {
            status: data.status,
            total: data.total,
            summary: buildOrderSummary(data.items),
          });
          setOrderHistory(next);
        }
      } catch {
        /* ignore polling errors */
      }
    }

    fetchTracking();
    const interval = window.setInterval(fetchTracking, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeOrderCode]);

  const value = useMemo(
    () => ({
      settings,
      categories,
      promos,
      cart,
      modalItem,
      openModal: setModalItem,
      closeModal: () => setModalItem(null),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toast,
      showToast,
      deliveryType,
      setDeliveryType,
      activeOrderCode,
      tracking,
      orderHistory,
      refreshOrderHistory,
      repeatOrder,
      submitOrder,
      addProductToCart,
      addPromoToCart,
      openWhatsAppDirect,
    }),
    [
      settings,
      categories,
      promos,
      cart,
      modalItem,
      drawerOpen,
      toast,
      showToast,
      deliveryType,
      activeOrderCode,
      tracking,
      orderHistory,
      refreshOrderHistory,
      repeatOrder,
      submitOrder,
      addProductToCart,
      addPromoToCart,
      openWhatsAppDirect,
    ],
  );

  return (
    <PublicStoreContext.Provider value={value}>
      {children}
    </PublicStoreContext.Provider>
  );
}
