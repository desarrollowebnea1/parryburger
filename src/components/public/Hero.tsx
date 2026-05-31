"use client";

import PublicImage from "@/components/public/PublicImage";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function Hero() {
  const { settings, openWhatsAppDirect } = usePublicStore();

  return (
    <section id="hero" className="relative grid min-h-screen grid-cols-1 overflow-hidden pt-[66px] lg:grid-cols-2">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 65% 50%, rgba(232,72,10,0.12) 0%, transparent 65%), linear-gradient(160deg, #080808 0%, #100400 45%, #080808 100%)",
        }}
      />
      <div className="hero-bg-noise absolute inset-0 opacity-[0.03]" />

      <div className="relative z-[2] flex flex-col justify-center px-6 py-10 md:px-14 lg:px-14 lg:py-20">
        {settings.heroTag ? (
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[2.5px] text-brand-orange">
            {settings.heroTag}
          </div>
        ) : null}

        <h1 className="hero-title mb-[18px] font-display text-[clamp(60px,9vw,120px)] leading-[0.88] tracking-wide">
          <span className="block text-brand-cream">{settings.heroTitleLine1 || "SABORES"}</span>
          <span className="block text-brand-cream">{settings.heroTitleLine2 || "QUE TE"}</span>
          <span className="block text-brand-orange [text-shadow:0_0_60px_rgba(232,72,10,0.4)]">
            {settings.heroTitleLine3 || "ENCANTAN"}
          </span>
        </h1>

        {settings.heroDescription ? (
          <p className="mb-9 max-w-[360px] text-base leading-relaxed text-brand-cream/55">
            {settings.heroDescription}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <a href="#menu-section" className="btn-primary">
            🍔 Ver Menú
          </a>
          <button type="button" className="btn-outline" onClick={openWhatsAppDirect}>
            💬 Hacer Pedido
          </button>
        </div>

        <div className="mt-11 flex flex-wrap gap-7 border-t border-white/[0.07] pt-8">
          {[
            ["🛵", "Envío Rápido"],
            ["💬", "Pedí por WhatsApp"],
            ["⏱️", "Seguí tu Pedido"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-cream/45"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange/10 text-base">
                {icon}
              </div>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[2] hidden items-center justify-center px-5 py-20 lg:flex lg:px-10">
        <div className="relative w-full max-w-[520px]">
          <div className="absolute -inset-[30px] -z-10 animate-glow-pulse rounded-full bg-[radial-gradient(ellipse,rgba(232,72,10,0.22)_0%,transparent_68%)]" />
          <PublicImage
            src={settings.heroImageUrl}
            alt="Parry Burger - Hamburguesa con papas"
            position={settings.heroImagePosition}
            aspectClass="aspect-[4/5]"
            roundedClass="rounded-[18px] shadow-hero-img"
            priority
            sizes="(max-width: 1280px) 50vw, 520px"
          />
        </div>
      </div>
    </section>
  );
}
