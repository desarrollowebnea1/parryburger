"use client";

import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  WhatsAppIconOnGreen,
} from "@/components/public/BrandIcons";
import { formatWhatsAppDisplay, instagramHandle } from "@/lib/format";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function ContactSection() {
  const { settings, openWhatsAppDirect } = usePublicStore();

  const igLabel = instagramHandle(settings.instagramUrl);
  const fbLabel = settings.facebookUrl
    ? settings.businessName
    : "Parry Burger Express";

  return (
    <div className="info-card">
      <div className="info-card-title">Contacto</div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
          <WhatsAppIcon size={22} />
        </div>
        <div>
          <strong className="block break-all text-[13px] font-extrabold">
            {formatWhatsAppDisplay(settings.whatsappNumber)}
          </strong>
          <span className="text-[11px] text-brand-cream/40">WhatsApp pedidos</span>
        </div>
      </div>

      {igLabel ? (
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
            <InstagramIcon size={22} />
          </div>
          <div>
            <strong className="block break-words text-[13px] font-extrabold">{igLabel}</strong>
            <span className="text-[11px] text-brand-cream/40">Instagram</span>
          </div>
        </div>
      ) : null}

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
          <FacebookIcon size={22} />
        </div>
        <div>
          <strong className="block break-words text-[13px] font-extrabold">{fbLabel}</strong>
          <span className="text-[11px] text-brand-cream/40">Facebook</span>
        </div>
      </div>

      <button type="button" className="wa-contact-btn mt-1" onClick={openWhatsAppDirect}>
        <WhatsAppIconOnGreen size={20} />
        ESCRIBINOS POR WHATSAPP
      </button>
    </div>
  );
}
