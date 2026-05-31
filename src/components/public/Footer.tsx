"use client";

import { usePublicStore } from "@/context/PublicStoreProvider";

export default function Footer() {
  const { settings } = usePublicStore();
  const text =
    settings.footerText ||
    `© ${new Date().getFullYear()} Parry Burger Express. Todos los derechos reservados.`;

  const parts = text.split("Parry Burger Express");

  return (
    <footer className="border-t border-white/[0.04] bg-brand-black2 px-7 py-[22px] text-center text-xs text-brand-cream/25">
      <p>
        {parts.length > 1 ? (
          <>
            {parts[0]}
            <span className="text-brand-orange">Parry Burger Express</span>
            {parts.slice(1).join("Parry Burger Express")}
          </>
        ) : (
          text
        )}
      </p>
    </footer>
  );
}
