import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { getMilkTypeStyle } from "../utils/milkTypeStyles";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const availableTypes = useMemo(
    () => [...new Set(products.map((p) => p.milkType))],
    [products]
  );

  const filtered = useMemo(
    () => (activeFilter === "all" ? products : products.filter((p) => p.milkType === activeFilter)),
    [products, activeFilter]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-soft sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            🥛 Farm fresh, every morning
          </span>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Our Products
          </h1>
          <p className="max-w-md text-sm text-white/75">
            Fresh milk and dairy, sourced daily from trusted local farms — chilled within hours
            and delivered straight to your door.
          </p>
        </div>
      </div>

      {!loading && !error && products.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`hover-pop rounded-full px-4 py-2 text-sm font-semibold ${
              activeFilter === "all"
                ? "bg-brand-600 text-white shadow-soft"
                : "border border-brand-900/10 bg-cream-50 text-brand-900/70 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            🥛 All
          </button>
          {availableTypes.map((type) => {
            const style = getMilkTypeStyle(type);
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`hover-pop rounded-full px-4 py-2 text-sm font-semibold ${
                  activeFilter === type
                    ? style.chipActive
                    : "border border-brand-900/10 bg-cream-50 text-brand-900/70 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                {style.icon} {style.label}
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span aria-hidden>⚠️</span> {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-square w-full animate-pulse bg-brand-100" />
              <div className="flex flex-col gap-2 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-brand-100" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-brand-100" />
                <div className="mt-1 h-8 w-full animate-pulse rounded-lg bg-brand-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-4xl">
            🥛
          </span>
          <p className="text-brand-900/60">
            {products.length === 0 ? "No products available right now." : "No products match this filter."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product, i) => (
            <div key={product._id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
