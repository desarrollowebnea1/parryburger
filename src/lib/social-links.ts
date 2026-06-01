/**
 * Normaliza un número argentino para wa.me (solo dígitos, prefijo 54).
 */
export function normalizeWhatsAppDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("54") && digits.length >= 12) {
    return digits;
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Móvil local: 15 + 8 dígitos (sin código de área en BD)
  if (digits.startsWith("15") && digits.length === 10) {
    return `549379${digits.slice(2)}`;
  }

  if (!digits.startsWith("54")) {
    if (digits.length === 11 && digits.startsWith("9")) {
      return `54${digits}`;
    }
    if (digits.length === 10 && /^3\d{2}/.test(digits)) {
      return `54${digits.slice(0, 3)}9${digits.slice(3)}`;
    }
    return `54${digits}`;
  }

  return digits;
}

export function buildWhatsAppChatUrl(whatsappNumber: string, message?: string): string {
  const digits = normalizeWhatsAppDigits(whatsappNumber);
  if (!digits) return "https://wa.me/";
  if (message?.trim()) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`;
  }
  return `https://wa.me/${digits}`;
}

export function buildInstagramUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).href;
    } catch {
      return null;
    }
  }

  const handle = trimmed.replace(/^@/, "").replace(/^\//, "").split("/")[0];
  if (!handle) return null;
  return `https://instagram.com/${encodeURIComponent(handle)}`;
}

export function buildFacebookUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).href;
    } catch {
      return null;
    }
  }

  const page = trimmed.replace(/^@/, "").replace(/^\//, "").split("/")[0];
  if (!page) return null;
  return `https://facebook.com/${encodeURIComponent(page)}`;
}
