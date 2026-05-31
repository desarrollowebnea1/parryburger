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
      className="fixed bottom-5 right-5 z-[800] flex h-[58px] w-[58px] items-center justify-center rounded-full border-none bg-brand-orange text-[22px] text-white shadow-[0_6px_20px_rgba(232,72,10,0.4)] transition-transform hover:scale-105 lg:hidden"
      onClick={openDrawer}
    >
      🛒
      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[11px] font-black text-brand-black">
        {cart.itemCount}
      </span>
    </button>
  );
}

function Toast() {
  const { toast } = usePublicStore();
  return (
    <div
      className={`fixed bottom-7 right-7 z-[9999] flex items-center gap-2 rounded-lg bg-whatsapp px-[22px] py-3 text-sm font-extrabold text-white transition-transform duration-300 ${
        toast ? "translate-x-0" : "translate-x-[120%]"
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
        className="mx-auto grid max-w-site items-start gap-7 px-7 py-14 lg:grid-cols-[1fr_380px]"
      >
        <div id="main-col">
          <PromosSection />
          <MenuSection />
        </div>
        <CartSidebar />
      </div>

      <div id="bottom-section" className="mx-auto max-w-site px-7 pb-16">
        <div id="contacto-section" className="sec-title">
          📍 DÓNDE ESTAMOS
        </div>
        <div className="mt-2 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
