import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import UpcomingDeliveries from "../components/UpcomingDeliveries";

const statusStyles = {
  active: "bg-brand-100 text-brand-700",
  paused: "bg-gold-100 text-gold-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function Subscriptions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = () => {
    api
      .get("/subscriptions/my")
      .then((res) => setSubs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const changeStatus = async (id, status) => {
    setBusyId(id);
    try {
      await api.put(`/subscriptions/${id}/status`, { status });
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="text-sm text-brand-900/50">Loading...</p>;

  if (subs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-4xl">🔁</p>
        <p className="text-brand-900/60">No subscriptions yet</p>
        <Link to="/" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-xl font-semibold text-brand-900">My Subscriptions</h1>

      {subs.map((sub) => (
        <div key={sub._id} className="card flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-brand-900">{sub.product?.name}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[sub.status]}`}
            >
              {sub.status}
            </span>
          </div>
          <p className="text-xs text-brand-900/50">
            {sub.packSize} × {sub.quantity} · ₹{sub.price} · Daily · {sub.paymentMethod}
          </p>
          <p className="text-xs text-brand-900/50">
            {sub.deliveryAddress.houseNumber}, {sub.deliveryAddress.street}, {sub.deliveryAddress.city} -{" "}
            {sub.deliveryAddress.pincode}
          </p>
          <p className="text-xs text-brand-900/40">
            Started {new Date(sub.startDate).toLocaleDateString()}
          </p>

          <div className="mt-1 flex flex-wrap gap-2">
            {sub.status === "active" && (
              <button
                disabled={busyId === sub._id}
                onClick={() => changeStatus(sub._id, "paused")}
                className="rounded-lg border border-gold-300 px-3 py-1.5 text-xs font-semibold text-gold-700 transition hover:bg-gold-50 disabled:opacity-60"
              >
                Pause
              </button>
            )}
            {sub.status === "paused" && (
              <button
                disabled={busyId === sub._id}
                onClick={() => changeStatus(sub._id, "active")}
                className="rounded-lg border border-brand-300 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 disabled:opacity-60"
              >
                Resume
              </button>
            )}
            {sub.status !== "cancelled" && (
              <button
                disabled={busyId === sub._id}
                onClick={() => changeStatus(sub._id, "cancelled")}
                className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
              >
                Cancel
              </button>
            )}
            {sub.status === "active" && (
              <button
                onClick={() => setExpandedId(expandedId === sub._id ? null : sub._id)}
                className="ml-auto rounded-lg border border-brand-900/15 px-3 py-1.5 text-xs font-semibold text-brand-900/70 transition hover:bg-cream-100"
              >
                {expandedId === sub._id ? "Hide Deliveries" : "Manage Upcoming Deliveries"}
              </button>
            )}
          </div>

          {expandedId === sub._id && (
            <div className="mt-2 border-t border-brand-900/10 pt-3">
              <UpcomingDeliveries subscriptionId={sub._id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
