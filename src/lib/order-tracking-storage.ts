import type { OrderStatus } from "@prisma/client";

export type StoredOrderHistoryEntry = {
  orderCode: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  customerName?: string;
  summary: string;
};

const ORDER_HISTORY_KEY = "parry_order_history_v1";
const LEGACY_LAST_ORDER_KEY = "parry_last_order_v1";
const MAX_HISTORY = 20;

let legacyMigrated = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function ensureLegacyMigration(): void {
  if (!isBrowser() || legacyMigrated) return;
  legacyMigrated = true;

  try {
    const legacyCode = window.localStorage.getItem(LEGACY_LAST_ORDER_KEY);
    if (!legacyCode) return;

    const history = readRawHistory();
    if (!history.some((entry) => entry.orderCode === legacyCode)) {
      history.unshift({
        orderCode: legacyCode,
        createdAt: new Date().toISOString(),
        total: 0,
        status: "NUEVO",
        summary: "Pedido anterior",
      });
      writeRawHistory(history);
    }

    window.localStorage.removeItem(LEGACY_LAST_ORDER_KEY);
  } catch {
    /* ignore */
  }
}

function readRawHistory(): StoredOrderHistoryEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(ORDER_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredOrderHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRawHistory(history: StoredOrderHistoryEntry[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      ORDER_HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY)),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

export function buildOrderSummary(
  items: Array<{ name: string; quantity: number }>,
): string {
  if (!items.length) return "Pedido sin items";
  const text = items.map((item) => `${item.quantity}x ${item.name}`).join(", ");
  return text.length > 80 ? `${text.slice(0, 77)}...` : text;
}

export function saveOrderHistory(
  history: StoredOrderHistoryEntry[],
): StoredOrderHistoryEntry[] {
  ensureLegacyMigration();
  writeRawHistory(history);
  return history.slice(0, MAX_HISTORY);
}

export function getOrderHistory(): StoredOrderHistoryEntry[] {
  ensureLegacyMigration();
  return readRawHistory();
}

export function getLastOrder(): StoredOrderHistoryEntry | null {
  const history = getOrderHistory();
  return history[0] ?? null;
}

export function addOrderToHistory(
  order: StoredOrderHistoryEntry,
): StoredOrderHistoryEntry[] {
  ensureLegacyMigration();
  const history = readRawHistory().filter(
    (entry) => entry.orderCode !== order.orderCode,
  );
  history.unshift(order);
  writeRawHistory(history);
  return history.slice(0, MAX_HISTORY);
}

export function updateOrderInHistory(
  orderCode: string,
  patch: Partial<Omit<StoredOrderHistoryEntry, "orderCode">>,
): StoredOrderHistoryEntry[] {
  ensureLegacyMigration();
  const history = readRawHistory();
  const next = history.map((entry) =>
    entry.orderCode === orderCode ? { ...entry, ...patch } : entry,
  );
  writeRawHistory(next);
  return next.slice(0, MAX_HISTORY);
}

export function removeOrderFromHistory(orderCode: string): StoredOrderHistoryEntry[] {
  ensureLegacyMigration();
  const next = readRawHistory().filter((entry) => entry.orderCode !== orderCode);
  writeRawHistory(next);
  return next;
}

export function clearOrderHistory(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ORDER_HISTORY_KEY);
  } catch {
    /* ignore */
  }
}

/** @deprecated Use getLastOrder().orderCode */
export function readLastOrderCode(): string | null {
  return getLastOrder()?.orderCode ?? null;
}

/** @deprecated Use addOrderToHistory() */
export function saveLastOrderCode(orderCode: string): void {
  addOrderToHistory({
    orderCode,
    createdAt: new Date().toISOString(),
    total: 0,
    status: "NUEVO",
    summary: "Pedido",
  });
}
