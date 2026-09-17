import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";
import MilkBottleIcon from "../components/MilkBottleIcon";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="hero-gradient relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-soft sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -left-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur">
            📦 Track every drop
          </span>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            My Orders
          </h1>
          <p className="max-w-md text-sm text-white/75">
            All your past and upcoming deliveries, in one place.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card flex items-center gap-3 p-3">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-brand-100" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-brand-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-brand-100" />
              </div>
              <div className="h-4 w-12 shrink-0 animate-pulse rounded bg-brand-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-4xl">
            📦
          </span>
          <p className="text-brand-900/60">No orders yet</p>
          <Link to="/" className="btn btn-primary">
            Order Milk
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="flex flex-col gap-3">
          {orders.map((order, i) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card group fade-in-up flex items-center gap-3 p-3 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-lg"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-soft">
                <MilkBottleIcon className="h-5 w-5" />
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-brand-900">
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <p className="line-clamp-1 text-xs text-brand-900/45">
                  {order.items
                    .map((item) => `${item.productName} (${item.packSize}) × ${item.quantity}`)
                    .join(", ")}{" "}
                  · {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="font-display text-base font-semibold text-brand-900">
                  ₹{order.totalAmount}
                </span>
                <span className="text-brand-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
