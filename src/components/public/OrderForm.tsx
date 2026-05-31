"use client";

import { FormEvent, useState } from "react";
import { formatMoney } from "@/lib/format";
import { usePublicStore } from "@/context/PublicStoreProvider";

type OrderFormProps = {
  idPrefix?: string;
};

export default function OrderForm({ idPrefix = "" }: OrderFormProps) {
  const {
    settings,
    cart,
    deliveryType,
    setDeliveryType,
    submitOrder,
  } = usePublicStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deliveryCost =
    deliveryType === "DELIVERY" ? settings.deliveryCost : 0;
  const total = cart.subtotal + deliveryCost;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    const result = await submitOrder({
      customerName: String(data.get("customerName") || "").trim(),
      customerPhone: String(data.get("customerPhone") || "").trim(),
      address: String(data.get("address") || "").trim() || undefined,
      zone: String(data.get("zone") || "").trim() || undefined,
      paymentMethod: String(data.get("paymentMethod") || "").trim(),
      notes: String(data.get("notes") || "").trim() || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    form.reset();
  }

  if (!cart.items.length) return null;

  return (
    <form onSubmit={handleSubmit} className="cart-delivery px-4 pb-3.5">
      <div className="mb-2.5 flex overflow-hidden rounded-lg border border-brand-gray1 bg-brand-black2">
        <button
          type="button"
          className={`del-opt ${deliveryType === "RETIRO" ? "del-opt-active" : ""}`}
          onClick={() => setDeliveryType("RETIRO")}
        >
          🏠 Retiro
        </button>
        <button
          type="button"
          className={`del-opt ${deliveryType === "DELIVERY" ? "del-opt-active" : ""}`}
          onClick={() => setDeliveryType("DELIVERY")}
        >
          🛵 Delivery
        </button>
      </div>

      <label className="cart-input-label" htmlFor={`${idPrefix}customerName`}>
        Tu nombre *
      </label>
      <input
        id={`${idPrefix}customerName`}
        name="customerName"
        required
        className="cart-input"
        placeholder="Juan Pérez"
      />

      {deliveryType === "DELIVERY" ? (
        <>
          <label className="cart-input-label" htmlFor={`${idPrefix}address`}>
            Dirección *
          </label>
          <input
            id={`${idPrefix}address`}
            name="address"
            required
            className="cart-input"
            placeholder="Av. Ejemplo 1234"
          />
          <label className="cart-input-label" htmlFor={`${idPrefix}zone`}>
            Barrio/Zona
          </label>
          <input
            id={`${idPrefix}zone`}
            name="zone"
            className="cart-input"
            placeholder="Centro"
          />
        </>
      ) : null}

      <label className="cart-input-label" htmlFor={`${idPrefix}customerPhone`}>
        Teléfono
      </label>
      <input
        id={`${idPrefix}customerPhone`}
        name="customerPhone"
        required
        className="cart-input"
        placeholder="3794 000 000"
      />

      <label className="cart-input-label" htmlFor={`${idPrefix}paymentMethod`}>
        Forma de pago *
      </label>
      <select
        id={`${idPrefix}paymentMethod`}
        name="paymentMethod"
        required
        className="pago-select"
        defaultValue=""
      >
        <option value="">— Seleccioná —</option>
        {settings.paymentMethods.map((method) => (
          <option key={method.id} value={method.label}>
            {method.label}
          </option>
        ))}
      </select>

      <label className="cart-input-label" htmlFor={`${idPrefix}notes`}>
        Aclaraciones
      </label>
      <input
        id={`${idPrefix}notes`}
        name="notes"
        className="cart-input"
        placeholder="Sin cebolla, extra salsa..."
      />

      {error ? <p className="mb-2 text-xs text-brand-orange">{error}</p> : null}

      <div className="cart-cta px-0 pb-0 pt-1">
        <button type="submit" className="wa-send-btn" disabled={loading}>
          {loading ? "ENVIANDO..." : "ENVIAR PEDIDO"}
        </button>
      </div>

      <p className="mt-2 text-center text-[11px] text-brand-cream/30">
        Total estimado: {formatMoney(total)}
      </p>
    </form>
  );
}
