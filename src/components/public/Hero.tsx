"use client";

import PublicImage from "@/components/public/PublicImage";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function Hero() {
  const { settings, openWhatsAppDirect } = usePublicStore();

  return (
    <section
      id="hero"
      className="public-section-anchor relative grid min-h-[calc(100dvh-66px)] grid-cols-1 overflow-hidden sm:min-h-screen lg:grid-cols-2"
      style={{ paddingTop: "var(--nav-offset, 66px)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 65% 50%, rgba(232,72,10,0.12) 0%, transparent 65%), linear-gradient(160deg, #080808 0%, #100400 45%, #080808 100%)",
        }}
      />
      <div className="hero-bg-noise absolute inset-0 opacity-[0.03]" />

      <div className="relative z-[2] flex flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-14 lg:px-14 lg:py-20">
        {settings.heroTag ? (
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[2px] text-brand-orange sm:mb-5 sm:px-3.5 sm:text-[11px] sm:tracking-[2.5px]">
            <span className="truncate">{settings.heroTag}</span>
          </div>
        ) : null}

        <h1 className="hero-title mb-4 font-display text-[clamp(2.5rem,11vw,7.5rem)] leading-[0.92] tracking-wide sm:mb-[18px] sm:leading-[0.88]">
          <span className="block break-words text-brand-cream">
            {settings.heroTitleLine1 || "SABORES"}
          </span>
          <span className="block break-words text-brand-cream">
            {settings.heroTitleLine2 || "QUE TE"}
          </span>
          <span className="block break-words text-brand-orange [text-shadow:0_0_60px_rgba(232,72,10,0.4)]">
            {settings.heroTitleLine3 || "ENCANTAN"}
          </span>
        </h1>

        {settings.heroDescription ? (
          <p className="mb-6 max-w-[360px] text-sm leading-relaxed text-brand-cream/55 sm:mb-9 sm:text-base">
            {settings.heroDescription}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          <a href="#menu-section" className="btn-primary px-5 py-3 text-[13px] sm:px-[26px] sm:py-3.5 sm:text-sm">
            🍔 Ver Menú
          </a>
          <button
            type="button"
            className="btn-outline px-5 py-3 text-[13px] sm:px-[26px] sm:py-3.5 sm:text-sm"
            onClick={openWhatsAppDirect}
          >
            💬 Hacer Pedido
          </button>
        </div>

        <div className="mt-7 flex flex-wrap gap-4 border-t border-white/[0.07] pt-6 sm:mt-11 sm:gap-7 sm:pt-8">
          {[
            ["🛵", "Envío Rápido"],
            ["💬", "Pedí por WhatsApp"],
            ["⏱️", "Seguí tu Pedido"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex min-w-0 items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-brand-cream/45 sm:text-xs"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-base">
                {icon}
              </div>
              <span className="truncate">{label}</span>
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
