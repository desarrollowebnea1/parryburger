/** Brand and layout constants — values from legacy/index.html */
export const BRAND = {
  orange: "#E8480A",
  orangeDark: "#BF3A07",
  orangeGlow: "rgba(232,72,10,0.18)",
  black: "#080808",
  black2: "#0F0F0F",
  black3: "#161616",
  black4: "#1E1E1E",
  card: "#141414",
  border: "#2A2A2A",
  gray1: "#2A2A2A",
  gray2: "#383838",
  gray3: "#555555",
  cream: "#F7F2EA",
  white: "#FFFFFF",
  whatsapp: "#25D366",
  whatsappDark: "#1da851",
  yellow: "#FFD600",
} as const;

export const LAYOUT = {
  navbarHeight: 66,
  maxWidth: 1280,
  cartColumnWidth: 380,
  radius: 10,
} as const;

export const CART_STORAGE_KEY = "parry_cart_v1";

export const UPLOAD = {
  maxSizeBytes: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
} as const;

export const SESSION_COOKIE = "parry_session";

/** 7 days in seconds */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
