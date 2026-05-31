"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePublicStore } from "@/context/PublicStoreProvider";
import { LAYOUT } from "@/lib/constants";

const NAV_LINKS = [
  { href: "#hero", label: "Inicio" },
  { href: "#menu-section", label: "Menú" },
  { href: "#promos-section", label: "Promociones" },
  { href: "#contacto-section", label: "Contacto" },
] as const;

export default function Navbar() {
  const { cart } = usePublicStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onScroll = () => closeMobile();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  function handleNavClick() {
    closeMobile();
  }

  return (
    <>
      <nav className="public-nav fixed left-0 right-0 top-0 z-[900] border-b border-white/[0.06] bg-[rgba(8,8,8,0.97)] pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl">
        <div
          className="flex items-center px-4 sm:px-7"
          style={{ height: LAYOUT.navbarHeight }}
        >
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="rounded-md bg-brand-orange px-2.5 py-1.5 text-center leading-none">
            <span className="block font-display text-[19px] text-white">PARRY</span>
            <span className="block font-display text-sm text-brand-black">BURGER</span>
            <span className="block font-body text-[8px] font-extrabold uppercase tracking-[2px] text-white">
              EXPRESS
            </span>
          </div>
        </div>

        <div className="ml-6 hidden flex-1 items-center lg:ml-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent px-3.5 py-2 text-xs font-bold uppercase tracking-[1.5px] text-brand-cream/55 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("cart-sidebar");
              el?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="hidden items-center gap-2 rounded-[7px] border-none bg-brand-orange px-[18px] py-2.5 text-[13px] font-extrabold tracking-wide text-white transition-all hover:-translate-y-px hover:bg-brand-orange-dark md:flex"
          >
            🛒 Ver Carrito
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-brand-orange">
              {cart.itemCount}
            </span>
          </button>
          <Link
            href="/admin/login"
            className="hidden rounded-md border border-brand-gray1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-gray3 transition-colors hover:border-brand-orange hover:text-brand-orange sm:inline-block"
          >
            ⚙ ADMIN
          </Link>
          <button
            type="button"
            className="flex flex-col gap-1.5 rounded-md p-2 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-0.5 w-6 rounded-sm bg-brand-cream transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded-sm bg-brand-cream transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 rounded-sm bg-brand-cream transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
        </div>
      </nav>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="top-nav-offset fixed inset-x-0 bottom-0 z-[898] bg-black/75 lg:hidden"
            onClick={closeMobile}
          />
          <div className="top-nav-offset fixed left-0 right-0 z-[899] max-h-[min(70dvh,calc(100dvh-var(--nav-offset,66px)))] overflow-y-auto border-b border-brand-gray1 bg-brand-black2 shadow-[0_12px_40px_rgba(0,0,0,0.5)] lg:hidden">
            <nav className="py-2" aria-label="Menú móvil">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="block border-b border-white/[0.05] px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-brand-cream/80 transition-colors hover:bg-brand-orange/5 hover:text-brand-orange"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-white/[0.06] px-5 py-3">
                <Link
                  href="/admin/login"
                  onClick={handleNavClick}
                  className="inline-block text-[11px] font-semibold uppercase tracking-wide text-brand-cream/35 transition-colors hover:text-brand-cream/55"
                >
                  Acceso admin
                </Link>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </>
  );
}
