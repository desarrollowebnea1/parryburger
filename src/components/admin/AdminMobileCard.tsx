import type { ReactNode } from "react";

export default function AdminMobileCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`admin-mobile-card rounded-lg border border-brand-gray1 bg-brand-black2 p-4 ${className}`}
    >
      {children}
    </div>
  );
}
