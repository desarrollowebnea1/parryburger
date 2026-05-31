"use client";

import { usePublicStore } from "@/context/PublicStoreProvider";

export default function Footer() {
  const { settings } = usePublicStore();
  const text =
    settings.footerText ||
    `© ${new Date().getFullYear()} Parry Burger Express. Todos los derechos reservados.`;

  const parts = text.split("Parry Burger Express");

  return (
    <footer className="border-t border-white/[0.04] bg-brand-black2 px-4 py-4 text-center text-xs leading-relaxed text-brand-cream/25 sm:px-7 sm:py-[22px]">
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
