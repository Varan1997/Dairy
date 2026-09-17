import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MilkBottleIcon from "../components/MilkBottleIcon";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getMilkTypeStyle } from "../utils/milkTypeStyles";

function SectionHeading({ icon, children }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-900/80">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-sm">
        {icon}
      </span>
      {children}
    </h2>
  );
}

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryDate, setDeliveryDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // The delivery address (with exact map location) is captured once, at
  // registration/profile time — checkout just uses the saved default here.
  const address = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!address) {
      setError("Please add a delivery address in your profile first");
      return;
    }

    setLoading(true);

    const orderItems = items.map((i) => ({
      product: i.productId,
      packSizeId: i.packSizeId,
      quantity: i.quantity,
    }));

    try {
      const res = await api.post("/orders", {
        items: orderItems,
        deliveryAddress: address,
        deliveryDate,
        paymentMethod,
      });

      if (paymentMethod === "COD") {
        clearCart();
        navigate(`/orders/${res.data.order._id}`);
        return;
      }

      // ONLINE payment via Razorpay
      const { order, razorpayOrder, key } = res.data;
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try Cash on Delivery.");
        setLoading(false);
        return;
      }

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Fresh Dairy",
        description: "Milk order payment",
        order_id: razorpayOrder.id,
        prefill: { name: user?.name, contact: user?.phone },
        theme: { color: "#456b2e" },
        handler: async (response) => {
          try {
            await api.post(`/orders/${order._id}/verify-payment`, response);
            clearCart();
            navigate(`/orders/${order._id}`);
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-7 text-white shadow-soft">
        <div className="pointer-events-none absolute -left-10 -top-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-8 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-2">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            🧾 Almost there
          </span>
          <h1 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
            Checkout
          </h1>
        </div>
      </div>

      <div className="card p-4">
        <SectionHeading icon="🧾">Order Summary</SectionHeading>
        <div className="flex flex-col divide-y divide-brand-900/5">
          {items.map((item) => {
            const style = getMilkTypeStyle(item.milkType);
            return (
              <div
                key={`${item.productId}-${item.packSizeId}`}
                className="flex items-center justify-between gap-2 py-2 text-sm"
              >
                <span className="flex items-center gap-2 text-brand-900/80">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-base ${style.gradient}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <MilkBottleIcon className="h-4 w-4 text-brand-800" />
                    )}
                  </span>
                  {item.productName} ({item.size}) × {item.quantity}
                </span>
                <span className="font-medium text-brand-900">₹{item.price * item.quantity}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between border-t border-brand-900/10 pt-2 font-display font-semibold text-brand-900">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-900/80">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-sm">
                📍
              </span>
              Delivery Address
            </h2>
            <Link to="/profile" className="text-xs font-medium text-brand-600 hover:underline">
              Change
            </Link>
          </div>

          {address ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-brand-900/70">
                {address.houseNumber}, {address.street}
                {address.landmark ? `, ${address.landmark}` : ""}
                <br />
                {address.city} - {address.pincode}
              </p>
              {/* {address.location && (
                <div className="overflow-hidden rounded-xl">
                  <LocationMap lat={address.location.lat} lng={address.location.lng} height={140} />
                </div>
              )} */}
            </div>
          ) : (
            <p className="text-sm text-brand-900/50">
              No saved address yet.{" "}
              <Link to="/profile" className="font-medium text-brand-600 hover:underline">
                Add one in your profile
              </Link>{" "}
              to place an order.
            </p>
          )}
        </div>

        <div className="card p-4">
          <SectionHeading icon="📅">Delivery Date</SectionHeading>
          <input
            type="date"
            value={deliveryDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="input max-w-xs"
          />
        </div>

        <div className="card p-4">
          <SectionHeading icon="💳">Payment Method</SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "COD", icon: "💵", label: "Cash on Delivery" },
              { key: "ONLINE", icon: "💳", label: "Pay Online" },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPaymentMethod(opt.key)}
                className={`hover-pop flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-semibold ${
                  paymentMethod === opt.key
                    ? "border-brand-600 bg-brand-50 text-brand-900 shadow-soft dark:bg-brand-900/20 dark:text-cream-50"
                    : "border-brand-900/10 bg-cream-50 text-brand-900/60 hover:border-brand-300"
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span aria-hidden>⚠️</span> {error}
          </p>
        )}

        <button type="submit" disabled={loading || !address} className="btn btn-primary w-full">
          {loading ? "Placing Order..." : `Place Order — ₹${total}`}
        </button>
      </form>
    </div>
  );
}
