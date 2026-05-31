"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/public/ProductCard";
import { usePublicStore } from "@/context/PublicStoreProvider";

export default function MenuSection() {
  const { categories } = usePublicStore();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const tabs = useMemo(
    () => [{ id: "all", name: "Todos" }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    [categories],
  );

  const products = useMemo(() => {
    if (activeFilter === "all") {
      return categories.flatMap((category) =>
        category.products.map((product) => ({
          product,
          categoryName: category.name,
        })),
      );
    }
    const category = categories.find((c) => c.id === activeFilter);
    return (
      category?.products.map((product) => ({
        product,
        categoryName: category.name,
      })) ?? []
    );
  }, [categories, activeFilter]);

  return (
    <div id="menu-section" className="mt-[52px]">
      <div className="sec-title">🍽️ NUESTRO MENÚ</div>

      <div className="mb-[22px] flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeFilter === tab.id ? "tab-btn-active" : ""}`}
            onClick={() => setActiveFilter(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {products.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-[15px]">
          {products.map(({ product, categoryName }) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName}
            />
          ))}
        </div>
      ) : (
        <p className="py-5 text-sm text-brand-cream/30">
          No hay productos en esta categoría.
        </p>
      )}
    </div>
  );
}
