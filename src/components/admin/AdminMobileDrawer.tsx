"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/admin/LogoutButton";
import { ADMIN_NAV_ITEMS, isAdminNavActive } from "@/lib/admin/nav";

type AdminMobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function AdminMobileDrawer({ open, onClose }: AdminMobileDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú"
        className="fixed inset-0 z-[60] bg-black/75 md:hidden"
        onClick={onClose}
      />
      <aside className="fixed bottom-0 left-0 top-0 z-[61] flex w-[min(100%,280px)] flex-col border-r border-brand-gray1 bg-brand-black2 shadow-2xl md:hidden">
        <div className="flex items-center justify-between border-b border-brand-gray1 px-4 py-4">
          <span className="font-display text-xl tracking-[2px] text-brand-orange">
            Menú
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-xl text-brand-cream/50 hover:bg-brand-gray1"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`min-h-11 rounded-lg px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition-colors ${
                isAdminNavActive(pathname, item.href)
                  ? "bg-brand-orange text-white"
                  : "text-brand-cream/55 hover:bg-brand-orange/10 hover:text-brand-orange"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-brand-gray1 p-4">
          <LogoutButton className="w-full justify-center" />
        </div>
      </aside>
    </>
  );
}
