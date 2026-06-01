import { normalizeWhatsAppDigits } from "@/lib/social-links";

export const PLACEHOLDER_FOOD =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80";

export function formatMoney(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}

export function formatWhatsAppDisplay(number: string): string {
  const digits = normalizeWhatsAppDigits(number);
  if (digits.length === 13 && digits.startsWith("549")) {
    const national = digits.slice(3);
    return `+54 ${national[0]} ${national.slice(1, 5)} ${national.slice(5)}`;
  }
  if (digits.length <= 10) return digits;
  return `${digits.slice(-10, -7)} ${digits.slice(-7, -4)} ${digits.slice(-4)}`;
}

export function instagramHandle(url: string | null): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    const handle = trimmed.replace(/^@/, "").replace(/^\//, "").split("/")[0];
    return handle ? `@${handle}` : "";
  }
  try {
    const path = new URL(trimmed).pathname.replace(/\//g, "");
    if (!path) return "";
    return path.startsWith("@") ? path : `@${path}`;
  } catch {
    return trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^@/, "")}`;
  }
}
