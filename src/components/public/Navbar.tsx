"use client";

import Link from "next/link";
import { useState } from "react";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function Navbar() {
  const { cart } = usePublicStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "#hero", label: "Inicio" },
    { href: "#menu-section", label: "Menú" },
    { href: "#promos-section", label: "Promociones" },
    { href: "#contacto-section", label: "Contacto" },
  ];

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[900] flex h-[66px] items-center border-b border-white/[0.06] bg-[rgba(8,8,8,0.97)] px-7 backdrop-blur-xl">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="rounded-md bg-brand-orange px-2.5 py-1.5 text-center leading-none">
            <span className="block font-display text-[19px] text-white">PARRY</span>
            <span className="block font-display text-sm text-brand-black">BURGER</span>
            <span className="block font-body text-[8px] font-extrabold uppercase tracking-[2px] text-white">
              EXPRESS
            </span>
          </div>
        </div>

        <div className="ml-10 hidden flex-1 items-center lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="border-b-2 border-transparent px-3.5 py-2 text-xs font-bold uppercase tracking-[1.5px] text-brand-cream/55 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2.5">
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
            className="flex flex-col gap-1.5 p-1 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menú"
          >
            <span className="block h-0.5 w-6 rounded-sm bg-brand-cream" />
            <span className="block h-0.5 w-6 rounded-sm bg-brand-cream" />
            <span className="block h-0.5 w-6 rounded-sm bg-brand-cream" />
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed left-0 right-0 top-[66px] z-[899] border-b border-brand-gray1 bg-brand-black2 py-3 lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block border-b border-white/[0.05] px-7 py-3 text-sm font-bold uppercase tracking-wide text-brand-cream/70 hover:bg-brand-orange/5 hover:text-brand-orange"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="block px-7 py-3 text-sm font-bold uppercase tracking-wide text-brand-orange"
          >
            ⚙ Admin
          </Link>
        </div>
      ) : null}
    </>
  );
}
