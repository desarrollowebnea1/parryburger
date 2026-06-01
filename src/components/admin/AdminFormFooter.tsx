import type { ReactNode } from "react";

export default function AdminFormFooter({ children }: { children: ReactNode }) {
  return (
    <div className="admin-form-footer sticky bottom-0 z-10 -mx-1 mt-6 border-t border-brand-gray1 bg-brand-black/95 px-1 py-4 backdrop-blur-sm md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
      <div className="[&_button]:min-h-11 [&_button]:w-full md:[&_button]:w-auto">{children}</div>
    </div>
  );
}
