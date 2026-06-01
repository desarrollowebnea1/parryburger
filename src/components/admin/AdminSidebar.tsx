"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS, isAdminNavActive } from "@/lib/admin/nav";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-brand-gray1 bg-brand-black2 md:block">
      <nav className="flex flex-col gap-1 p-4">
        {ADMIN_NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wide transition-colors ${
              isAdminNavActive(pathname, item.href)
                ? "bg-brand-orange text-white"
                : "text-brand-cream/45 hover:bg-brand-orange hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
