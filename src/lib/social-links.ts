/** Formato internacional AR móvil: 54 + 9 + código de área (3) + 7 dígitos = 13 dígitos. */
export const WHATSAPP_DIGITS_LENGTH = 13;

/**
 * Convierte la parte nacional (sin 54) al formato 9XXXXXXXXXX (11 dígitos).
 */
function normalizeNationalDigits(national: string): string {
  if (!national) return "";

  if (national.length === 11 && national.startsWith("9")) {
    return national;
  }

  const areaWithNine = national.match(/^(\d{3})9(\d{7})$/);
  if (areaWithNine) {
    return `9${areaWithNine[1]}${areaWithNine[2]}`;
  }

  const areaLocal = national.match(/^(\d{3})(\d{7})$/);
  if (areaLocal) {
    return `9${areaLocal[1]}${areaLocal[2]}`;
  }

  if (national.startsWith("15") && national.length === 10) {
    return `9379${national.slice(2)}`;
  }

  return national;
}

/**
 * Normaliza un número argentino para wa.me (solo dígitos, prefijo 54, con 9 móvil).
 * Ejemplo correcto: 5493794180972
 */
export function normalizeWhatsAppDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  while (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  const national = digits.startsWith("54") ? digits.slice(2) : digits;
  const normalizedNational = normalizeNationalDigits(national);

  if (
    normalizedNational.length === 11 &&
    normalizedNational.startsWith("9")
  ) {
    return `54${normalizedNational}`;
  }

  if (digits.startsWith("54")) {
    return digits;
  }

  return `54${normalizedNational}`;
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
