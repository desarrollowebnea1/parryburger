"use client";

import { formatMoney } from "@/lib/format";
import CartItemRow from "@/components/public/CartItem";
import OrderForm from "@/components/public/OrderForm";
import OrderSuccessPanel from "@/components/public/OrderSuccessPanel";
import OrderTracker from "@/components/public/OrderTracker";
import RecentOrdersPanel from "@/components/public/RecentOrdersPanel";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function CartSidebar() {
  const { settings, cart, deliveryType, activeOrderCode } = usePublicStore();

  const deliveryCost =
    deliveryType === "DELIVERY" ? settings.deliveryCost : 0;
  const total = cart.subtotal + deliveryCost;
  const hasItems = cart.items.length > 0;

  return (
    <div id="cart-sidebar" className="sticky top-20 hidden lg:block">
      <div className="cart-box">
        <div className="flex items-center justify-between border-b border-brand-gray1 bg-brand-black2 px-[18px] py-[15px]">
          <h3 className="font-cond text-lg font-black uppercase tracking-[2px]">
            🛒 Tu Pedido
          </h3>
          {hasItems ? (
            <button
              type="button"
              className="border-none bg-transparent text-[11px] font-bold uppercase tracking-wide text-brand-cream/30 hover:text-[#c0392b]"
              onClick={() => cart.clearCart()}
            >
              Vaciar
            </button>
          ) : null}
        </div>

        {hasItems ? (
          <>
            <div className="max-h-[300px] overflow-y-auto p-3">
              {cart.items.map((item) => (
                <CartItemRow key={item.key} item={item} />
              ))}
            </div>

            <div className="border-t border-brand-gray1 px-[18px] py-3.5">
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
            <OrderForm idPrefix="desktop" />
          </>
        ) : activeOrderCode ? (
          <div className="p-3">
            <OrderSuccessPanel orderCode={activeOrderCode} />
          </div>
        ) : (
          <div className="px-4 py-9 text-center text-[13px] leading-relaxed text-brand-cream/25">
            <span className="mb-2 block text-[32px]">🍔</span>
            Tu carrito está vacío.
            <br />
            ¡Agregá algo rico!
          </div>
        )}
      </div>

      <OrderTracker />
      <RecentOrdersPanel variant="sidebar" />
    </div>
  );
}
