"use client";

import type { ReactNode } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  WhatsAppIconOnGreen,
} from "@/components/public/BrandIcons";
import { formatWhatsAppDisplay, instagramHandle } from "@/lib/format";
import {
  buildFacebookUrl,
  buildInstagramUrl,
  buildWhatsAppChatUrl,
} from "@/lib/social-links";
import { usePublicStore } from "@/context/PublicStoreProvider";

type ContactLinkRowProps = {
  href: string;
  children: ReactNode;
};

function ContactLinkRow({ href, children }: ContactLinkRowProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-link-row mb-3 flex items-center gap-3"
    >
      {children}
    </a>
  );
}

export default function ContactSection() {
  const { settings } = usePublicStore();

  const whatsappUrl = buildWhatsAppChatUrl(settings.whatsappNumber);
  const instagramUrl = buildInstagramUrl(settings.instagramUrl);
  const facebookUrl = buildFacebookUrl(settings.facebookUrl);

  const igLabel = instagramHandle(settings.instagramUrl);
  const fbLabel = settings.facebookUrl
    ? settings.businessName
    : "Parry Burger Express";

  const whatsappMessage = `Hola ${settings.businessName}, quiero hacer un pedido`;
  const whatsappActionUrl = buildWhatsAppChatUrl(
    settings.whatsappNumber,
    whatsappMessage,
  );

  return (
    <div className="info-card">
      <div className="info-card-title">Contacto</div>

      <ContactLinkRow href={whatsappUrl}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
          <WhatsAppIcon size={22} />
        </div>
        <div>
          <strong className="block break-all text-[13px] font-extrabold text-brand-cream">
            {formatWhatsAppDisplay(settings.whatsappNumber)}
          </strong>
          <span className="text-[11px] text-brand-cream/40">WhatsApp pedidos</span>
        </div>
      </ContactLinkRow>

      {igLabel && instagramUrl ? (
        <ContactLinkRow href={instagramUrl}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
            <InstagramIcon size={22} />
          </div>
          <div>
            <strong className="block break-words text-[13px] font-extrabold text-brand-cream">
              {igLabel}
            </strong>
            <span className="text-[11px] text-brand-cream/40">Instagram</span>
          </div>
        </ContactLinkRow>
      ) : null}

      {facebookUrl ? (
        <ContactLinkRow href={facebookUrl}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
            <FacebookIcon size={22} />
          </div>
          <div>
            <strong className="block break-words text-[13px] font-extrabold text-brand-cream">
              {fbLabel}
            </strong>
            <span className="text-[11px] text-brand-cream/40">Facebook</span>
          </div>
        </ContactLinkRow>
      ) : (
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
            <FacebookIcon size={22} />
          </div>
          <div>
            <strong className="block break-words text-[13px] font-extrabold">
              {fbLabel}
            </strong>
            <span className="text-[11px] text-brand-cream/40">Facebook</span>
          </div>
        </div>
      )}

      <a
        href={whatsappActionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-contact-btn mt-1"
      >
        <WhatsAppIconOnGreen size={20} />
        ESCRIBINOS POR WHATSAPP
      </a>
    </div>
  );
}
