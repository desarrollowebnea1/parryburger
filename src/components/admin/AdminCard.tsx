import type { ReactNode } from "react";

export default function AdminCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="admin-card rounded-[10px] border border-brand-gray1 bg-brand-black3 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-cond text-base font-black uppercase tracking-[2px] text-brand-orange">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}
