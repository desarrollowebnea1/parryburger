"use client";

import { usePublicStore } from "@/context/PublicStoreProvider";

export default function BenefitsBar() {
  const { settings } = usePublicStore();
  const paymentLabels = settings.paymentMethods.map((m) => m.label).join(" · ");

  const items = [
    { icon: "🛵", title: "Envío Rápido", sub: "A domicilio" },
    { icon: "💬", title: "Pedí por WhatsApp", sub: "Rápido y fácil" },
    { icon: "⏱️", title: "Seguí tu Pedido", sub: "En tiempo real" },
    {
      icon: "💳",
      title: "Múltiples Pagos",
      sub: paymentLabels || "Efectivo · MP · Transfer",
    },
  ];

  return (
    <div id="benefits" className="border-y border-white/[0.05] bg-brand-black3 py-3 sm:py-[18px]">
      <div className="mx-auto flex max-w-site flex-wrap justify-center gap-6 px-4 sm:gap-12 sm:px-7">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-brand-orange/10 text-lg">
              {item.icon}
            </div>
            <div className="min-w-0">
              <strong className="block text-[12px] font-extrabold text-brand-cream sm:text-[13px]">
                {item.title}
              </strong>
              <span className="block truncate text-[10px] uppercase tracking-wide text-brand-cream/40 sm:text-[11px] sm:whitespace-normal">
                {item.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
