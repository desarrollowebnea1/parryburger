"use client";

import { WhatsAppIcon } from "@/components/public/BrandIcons";
import { usePublicStore } from "@/context/PublicStoreProvider";
import type { ReactNode } from "react";

export default function BenefitsBar() {
  const { settings } = usePublicStore();
  const paymentLabels = settings.paymentMethods.map((m) => m.label).join(" · ");

  const items: { icon: ReactNode; title: string; sub: string }[] = [
    { icon: "🛵", title: "Envío Rápido", sub: "A domicilio" },
    {
      icon: <WhatsAppIcon size={20} />,
      title: "Pedí por WhatsApp",
      sub: "Rápido y fácil",
    },
    { icon: "⏱️", title: "Seguí tu Pedido", sub: "En tiempo real" },
    {
      icon: "💳",
      title: "Múltiples Pagos",
      sub: paymentLabels || "Efectivo · MP · Transfer",
    },
  ];

  return (
    <div
      id="benefits"
      className="border-y border-white/[0.05] bg-brand-black3 py-3.5 sm:py-[18px]"
    >
      <div className="mx-auto grid max-w-site grid-cols-2 gap-x-3 gap-y-3.5 px-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-12 sm:px-7">
        {items.map((item) => (
          <div key={item.title} className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-brand-orange/10 text-base sm:h-10 sm:w-10 sm:text-lg [&_svg]:block">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-[11px] font-extrabold leading-tight text-brand-cream sm:text-[13px]">
                {item.title}
              </strong>
              <span className="mt-0.5 block line-clamp-2 text-[9px] uppercase leading-snug tracking-wide text-brand-cream/40 sm:text-[11px] sm:line-clamp-none sm:whitespace-normal">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
