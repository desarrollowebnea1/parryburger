import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#E8480A",
          "orange-dark": "#BF3A07",
          "orange-glow": "rgba(232,72,10,0.18)",
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
          yellow: "#FFD600",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1da851",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "cursive"],
        cond: ["var(--font-barlow-cond)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"],
      },
      borderRadius: {
        brand: "10px",
      },
      boxShadow: {
        brand: "0 8px 32px rgba(0,0,0,0.5)",
        "hero-img":
          "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        "btn-primary": "0 8px 20px rgba(232,72,10,0.3)",
      },
      maxWidth: {
        site: "1280px",
      },
      spacing: {
        navbar: "66px",
      },
      animation: {
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { opacity: "0.7", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
