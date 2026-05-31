"use client";

import { formatMoney } from "@/lib/format";
import CartItemRow from "@/components/public/CartItem";
import OrderForm from "@/components/public/OrderForm";
import OrderSuccessPanel from "@/components/public/OrderSuccessPanel";
import OrderTracker from "@/components/public/OrderTracker";
import RecentOrdersPanel from "@/components/public/RecentOrdersPanel";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function CartDrawer() {
  const { settings, cart, drawerOpen, closeDrawer, deliveryType, activeOrderCode } =
    usePublicStore();

  const deliveryCost =
    deliveryType === "DELIVERY" ? settings.deliveryCost : 0;
  const total = cart.subtotal + deliveryCost;
  const hasItems = cart.items.length > 0;
  const showSuccess = !hasItems && Boolean(activeOrderCode);

  if (!drawerOpen) return null;

  return (
    <div id="cart-drawer" className="fixed inset-0 z-[1400] lg:hidden">
      <div
        className="absolute inset-0 bg-black/80"
        onClick={closeDrawer}
        aria-hidden
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] animate-[drawerUp_0.25s_ease] overflow-y-auto rounded-t-2xl bg-brand-black2">
        <div className="mx-auto mt-3 h-1 w-9 rounded-sm bg-brand-gray1" />
        <button
          type="button"
          className="float-right mr-4 mt-[-28px] border-none bg-transparent text-xl text-brand-cream/40"
          onClick={closeDrawer}
        >
          ✕
        </button>

        <div className="px-4 pb-6 pt-4">
          <div className="mb-3.5 font-cond text-xl font-black uppercase tracking-[2px]">
            🛒 Tu Pedido
          </div>

          {hasItems ? (
            <>
              {cart.items.map((item) => (
                <CartItemRow key={item.key} item={item} />
              ))}

              <div className="mt-2.5 border-t border-brand-gray1 pt-2.5">
                <div className="mb-1.5 flex justify-between text-[13px] text-brand-cream/55">
                  <span>Subtotal</span>
                  <span>{formatMoney(cart.subtotal)}</span>
                </div>
                <div className="mb-1.5 flex justify-between text-[13px] text-brand-cream/55">
                  <span>Envío</span>
                  <span>
                    {deliveryType === "DELIVERY"
                      ? formatMoney(deliveryCost)
                      : "Gratis (retiro)"}
                  </span>
                </div>
                <div className="mt-2.5 flex justify-between border-t border-brand-gray1 pt-2.5 text-base font-black text-brand-cream">
                  <span>TOTAL</span>
                  <span className="font-display text-[28px] text-brand-orange">
                    {formatMoney(total)}
                  </span>
                </div>
              </div>

              <OrderForm idPrefix="mobile" />
            </>
          ) : showSuccess ? (
            <>
              <OrderSuccessPanel orderCode={activeOrderCode!} variant="drawer" />
              <OrderTracker />
              <RecentOrdersPanel variant="drawer" />
            </>
          ) : (
            <>
              <p className="py-8 text-center text-sm text-brand-cream/30">
                Tu carrito está vacío.
              </p>
              <RecentOrdersPanel variant="drawer" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
