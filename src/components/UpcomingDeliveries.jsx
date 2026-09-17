import { useEffect, useState } from "react";
import api from "../api/axios";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

export default function UpcomingDeliveries({ subscriptionId }) {
  const [days, setDays] = useState(null);
  const [busyDate, setBusyDate] = useState(null);

  const load = () => {
    api.get(`/subscriptions/${subscriptionId}/upcoming?days=7`).then((res) => setDays(res.data));
  };

  useEffect(load, [subscriptionId]);

  const toggleSkip = async (day) => {
    setBusyDate(day.date);
    try {
      await api.put(`/subscriptions/${subscriptionId}/day`, {
        date: day.date,
        skipped: !day.skipped,
        quantity: day.quantity,
      });
      load();
    } finally {
      setBusyDate(null);
    }
  };

  const changeQuantity = async (day, quantity) => {
    if (quantity < 1) return;
    setBusyDate(day.date);
    try {
      await api.put(`/subscriptions/${subscriptionId}/day`, {
        date: day.date,
        skipped: false,
        quantity,
      });
      load();
    } finally {
      setBusyDate(null);
    }
  };

  if (!days) return <p className="text-xs text-brand-900/40">Loading upcoming deliveries...</p>;

  return (
    <div className="flex flex-col gap-1.5">
      {days.map((day) => {
        const isBusy = busyDate === day.date;
        return (
          <div
            key={day.date}
            className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${
              day.skipped
                ? "border-brand-900/10 bg-cream-100 text-brand-900/40"
                : "border-brand-900/10"
            }`}
          >
            <span className="font-medium">{fmtDate(day.date)}</span>

            {!day.skipped && (
              <div className="flex items-center gap-1.5">
                <button
                  disabled={isBusy || day.quantity <= 1}
                  onClick={() => changeQuantity(day, day.quantity - 1)}
                  className="h-6 w-6 rounded border border-brand-900/15 disabled:opacity-40"
                >
                  −
                </button>
                <span className="w-4 text-center">{day.quantity}</span>
                <button
                  disabled={isBusy}
                  onClick={() => changeQuantity(day, day.quantity + 1)}
                  className="h-6 w-6 rounded border border-brand-900/15 disabled:opacity-40"
                >
                  +
                </button>
              </div>
            )}

            <button
              disabled={isBusy}
              onClick={() => toggleSkip(day)}
              className={`rounded-full px-2.5 py-1 font-semibold transition disabled:opacity-60 ${
                day.skipped
                  ? "bg-brand-100 text-brand-700"
                  : "bg-gold-100 text-gold-700 hover:bg-gold-200"
              }`}
            >
              {day.skipped ? "Skipped — Resume" : "Skip"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
