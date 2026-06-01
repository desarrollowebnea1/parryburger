"use client";

import { useState } from "react";
import AdminMobileDrawer from "@/components/admin/AdminMobileDrawer";
import LogoutButton from "@/components/admin/LogoutButton";

type AdminHeaderProps = {
  email: string;
  name?: string | null;
};

export default function AdminHeader({ email, name }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex min-h-14 items-center justify-between gap-3 border-b border-brand-gray1 bg-brand-black2 px-4 pt-[env(safe-area-inset-top,0px)] sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-brand-gray1 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <span className="block h-0.5 w-5 rounded-sm bg-brand-cream" />
            <span className="block h-0.5 w-5 rounded-sm bg-brand-cream" />
            <span className="block h-0.5 w-5 rounded-sm bg-brand-cream" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg tracking-[2px] text-brand-orange sm:text-[22px]">
              ⚙ ADMIN
            </h1>
            <span className="block truncate text-[10px] text-brand-cream/35 sm:text-xs">
              {name || email}
            </span>
          </div>
        </div>
        <div className="hidden md:block">
          <LogoutButton />
        </div>
      </header>
      <AdminMobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
