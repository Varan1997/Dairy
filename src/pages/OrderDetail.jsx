import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";
import OrderTracker from "../components/OrderTracker";
import MilkBottleIcon from "../components/MilkBottleIcon";

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

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Order not found"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.put(`/orders/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <div className="h-28 w-full animate-pulse rounded-3xl bg-brand-100" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card h-24 animate-pulse p-4">
            <div className="h-full w-full rounded-xl bg-brand-50" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-4xl">
          ⚠️
        </span>
        <p className="text-red-600">{error || "Order not found"}</p>
      </div>
    );
  }

  // Once admin confirms the order, the user can no longer cancel it themselves.
  const canCancel = order.orderStatus === "placed";

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-7 text-white shadow-soft">
        <div className="pointer-events-none absolute -left-10 -top-14 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-8 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />

        <div className="relative flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
              <MilkBottleIcon className="h-3.5 w-3.5" /> Order details
            </span>
            <h1 className="font-display mt-2 text-2xl font-semibold leading-tight">
              #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <OrderStatusBadge status={order.orderStatus} />
        </div>
      </div>

      <div className="card p-4">
        <SectionHeading icon="🚚">Track Order</SectionHeading>
        <OrderTracker status={order.orderStatus} />
      </div>

      <div className="card p-4">
        <SectionHeading icon="🧾">Items</SectionHeading>
        <div className="flex flex-col divide-y divide-brand-900/5">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 py-2 text-sm">
              <span className="flex items-center gap-2 text-brand-900/80">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-soft">
                  <MilkBottleIcon className="h-4 w-4" />
                </span>
                <span>
                  {item.productName} <span className="text-brand-900/40">({item.packSize})</span> ×{" "}
                  {item.quantity}
                </span>
              </span>
              <span className="font-medium text-brand-900">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t border-brand-900/10 pt-2 font-display font-semibold text-brand-900">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      <div className="card p-4 text-sm">
        <SectionHeading icon="📍">Delivery Address</SectionHeading>
        <p className="text-brand-900/70">
          {order.deliveryAddress.houseNumber}, {order.deliveryAddress.street}
          {order.deliveryAddress.landmark ? `, ${order.deliveryAddress.landmark}` : ""}
          <br />
          {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-brand-900/50">
          <span className="inline-flex items-center gap-1">
            📅 {new Date(order.deliveryDate).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1">🚴 {order.deliveryPartner}</span>
        </p>
        {order.deliveryAddress.location && (
          <div className="mt-3 flex flex-col gap-2">
            {/* <div className="overflow-hidden rounded-xl">
              <LocationMap
                lat={order.deliveryAddress.location.lat}
                lng={order.deliveryAddress.location.lng}
                height={160}
              />
            </div> */}
            <p className="flex items-center gap-2 text-xs">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${order.deliveryAddress.location.lat},${order.deliveryAddress.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline"
              >
                📍 Open in Google Maps
              </a>
              {order.deliveryAddress.location.accuracy && (
                <span className="text-brand-900/40">(±{order.deliveryAddress.location.accuracy}m accuracy)</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="card p-4 text-sm">
        <SectionHeading icon={order.paymentMethod === "cod" ? "💵" : "💳"}>Payment</SectionHeading>
        <p className="text-brand-900/70">
          Method: {order.paymentMethod?.toUpperCase()} · Status:{" "}
          <span className="font-medium text-brand-900">{order.paymentStatus}</span>
        </p>
      </div>

      {order.deliveryNotes && (
        <div className="card p-4 text-sm">
          <SectionHeading icon="📝">Delivery Notes</SectionHeading>
          <p className="text-brand-900/70">{order.deliveryNotes}</p>
        </div>
      )}

      {canCancel && (
        <button onClick={handleCancel} disabled={cancelling} className="btn btn-danger-outline">
          {cancelling ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
}
