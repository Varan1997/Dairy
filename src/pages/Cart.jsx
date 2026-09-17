import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { getMilkTypeStyle } from "../utils/milkTypeStyles";

export default function Cart() {
  const { items, updateQuantity, removeItem, patchItem, total } = useCart();
  const navigate = useNavigate();

  // Cart entries saved before `milkType` was tracked (or before a product's
  // own type changed, e.g. Ghee moving out of "other") can carry a stale value
  // — reconcile against the live catalog instead of making the user re-add items.
  useEffect(() => {
    if (items.length === 0) return;

    api
      .get("/products")
      .then((res) => {
        const byId = new Map(res.data.map((p) => [p._id, p.milkType]));
        items.forEach((i) => {
          const milkType = byId.get(i.productId);
          if (milkType && milkType !== i.milkType) {
            patchItem(i.productId, i.packSizeId, { milkType });
          }
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-soft sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
              🛒 Your basket
            </span>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Your Cart
            </h1>
          </div>
        </div>

        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-4xl">
            🛒
          </span>
          <p className="text-brand-900/60">Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-soft sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            🛒 Your basket
          </span>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Your Cart
          </h1>
          <p className="text-sm text-white/75">
            {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const style = getMilkTypeStyle(item.milkType);
          return (
          <div
            key={`${item.productId}-${item.packSizeId}`}
            className="card fade-in-up flex items-center gap-3 p-3"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br text-2xl shadow-soft ${style.gradient}`}
            >
              {item.image ? (
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span>{style.icon}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-brand-900">{item.productName}</p>
              <p className="text-xs text-brand-900/50">
                {item.size} · ₹{item.price} each
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-brand-900/10 bg-cream-50 px-1.5 py-1 shadow-soft">
              <button
                onClick={() => updateQuantity(item.productId, item.packSizeId, item.quantity - 1)}
                className="hover-scale flex h-6 w-6 items-center justify-center rounded-full text-sm text-brand-900/70 hover:bg-brand-50"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold text-brand-900">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.productId, item.packSizeId, item.quantity + 1)}
                className="hover-scale flex h-6 w-6 items-center justify-center rounded-full text-sm text-brand-900/70 hover:bg-brand-50"
              >
                +
              </button>
            </div>

            <div className="flex flex-col items-end gap-1 pl-1">
              <span className="font-display text-sm font-semibold text-brand-900">
                ₹{item.price * item.quantity}
              </span>
              <button
                onClick={() => removeItem(item.productId, item.packSizeId)}
                className="transition hover:translate-x-0.5 text-xs font-medium text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
          );
        })}
      </div>

      <div className="card flex items-center justify-between p-4 shadow-soft-lg">
        <div>
          <p className="text-xs text-brand-900/50">Total</p>
          <span className="font-display text-xl font-semibold text-brand-900">₹{total}</span>
        </div>
        <button onClick={handleCheckout} className="btn btn-primary">
          Checkout →
        </button>
      </div>
    </div>
  );
}
