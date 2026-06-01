import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  action?: ReactNode;
};

export default function AdminPageHeader({ title, action }: AdminPageHeaderProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <h2 className="font-display text-2xl tracking-[2px] text-brand-orange sm:text-3xl">
        {title}
      </h2>
      {action ? <div className="w-full sm:w-auto [&_a]:w-full [&_button]:w-full sm:[&_a]:w-auto sm:[&_button]:w-auto">{action}</div> : null}
    </div>
  );
}
