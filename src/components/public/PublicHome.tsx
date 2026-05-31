"use client";

import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import BenefitsBar from "@/components/public/BenefitsBar";
import PromosSection from "@/components/public/PromosSection";
import MenuSection from "@/components/public/MenuSection";
import CartSidebar from "@/components/public/CartSidebar";
import CartDrawer from "@/components/public/CartDrawer";
import ProductModal from "@/components/public/ProductModal";
import HoursSection from "@/components/public/HoursSection";
import MapSection from "@/components/public/MapSection";
import ContactSection from "@/components/public/ContactSection";
import Footer from "@/components/public/Footer";
import {
  PublicStoreProvider,
  usePublicStore,
} from "@/context/PublicStoreProvider";
import type {
  PublicCategory,
  PublicPromo,
  PublicSettings,
} from "@/types";

type PublicHomeProps = {
  settings: PublicSettings;
  categories: PublicCategory[];
  promos: PublicPromo[];
};

function MobileCartFloat() {
  const { cart, openDrawer } = usePublicStore();
  if (!cart.itemCount) return null;

  return (
    <button
      type="button"
      id="mobile-cart-float"
      className="mobile-fab-cart fixed z-[800] flex h-14 w-14 items-center justify-center rounded-full border-none bg-brand-orange text-[22px] text-white shadow-[0_6px_20px_rgba(232,72,10,0.4)] transition-transform active:scale-95 lg:hidden"
      onClick={openDrawer}
      aria-label="Abrir carrito"
    >
      🛒
      <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[11px] font-black text-brand-black">
        {cart.itemCount}
      </span>
    </button>
  );
}

function Toast() {
  const { toast } = usePublicStore();
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mobile-toast fixed z-[850] flex max-w-[min(100%,20rem)] items-center gap-2 rounded-lg bg-whatsapp px-4 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 sm:max-w-none sm:px-[22px] lg:z-[9999] ${
        toast
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {toast}
    </div>
  );
}

function PublicHomeContent() {
  return (
    <>
      <Navbar />
      <Hero />
      <BenefitsBar />

      <div
        id="main-layout"
        className="mx-auto grid max-w-site items-start gap-5 px-4 py-8 sm:gap-6 sm:px-6 sm:py-10 lg:grid-cols-[1fr_380px] lg:gap-7 lg:px-7 lg:py-14"
      >
        <div id="main-col">
          <PromosSection />
          <MenuSection />
        </div>
        <CartSidebar />
      </div>

      <div
        id="bottom-section"
        className="mx-auto max-w-site px-4 pb-10 sm:px-6 sm:pb-12 lg:px-7 lg:pb-16"
      >
        <div id="contacto-section" className="sec-title public-section-anchor">
          📍 DÓNDE ESTAMOS
        </div>
        <div className="mt-2 grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          <HoursSection />
          <MapSection />
          <ContactSection />
        </div>
      </div>

      <Footer />
      <ProductModal />
      <CartDrawer />
      <MobileCartFloat />
      <Toast />
    </>
  );
}

export default function PublicHome({
  settings,
  categories,
  promos,
}: PublicHomeProps) {
  return (
    <PublicStoreProvider
      settings={settings}
      categories={categories}
      promos={promos}
    >
      <PublicHomeContent />
    </PublicStoreProvider>
  );
}
