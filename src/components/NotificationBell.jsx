import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderNotifications, orderStatusCopy } from "../context/OrderNotificationContext";

const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
};

export default function NotificationBell() {
  const notifications = useOrderNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!notifications) return null;
  const { notifications: items, unreadCount, markAllRead } = notifications;

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) markAllRead();
      return !o;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleOpen}
        className="hover-scale relative flex h-10 w-10 items-center justify-center rounded-full text-brand-900/70 hover:bg-brand-100 hover:text-brand-800"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white shadow-soft">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="card absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden shadow-soft-lg">
            <div className="hero-gradient relative overflow-hidden px-4 py-3 text-white">
              <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <span className="relative flex items-center gap-1.5 text-sm font-semibold">
                🔔 Order Updates
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                 
                  <p className="text-sm text-brand-900/40">No notifications yet</p>
                </div>
              )}
              {items.map((n) => {
                const copy = orderStatusCopy[n.orderStatus] || {
                  icon: "📦",
                  label: "Order updated",
                  iconBg: "bg-brand-100 text-brand-700",
                };
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/orders/${n.orderId}`);
                    }}
                    className={`flex w-full items-start gap-2.5 border-b border-brand-900/[0.06] p-3 text-left transition hover:bg-cream-100 ${
                      n.read ? "" : "bg-brand-50/60 dark:bg-brand-900/20"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${copy.iconBg}`}
                    >
                      {copy.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-brand-900">{copy.label}</span>
                        {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />}
                      </span>
                      <span className="block truncate text-xs text-brand-900/50">{n.itemsSummary}</span>
                      <span className="flex items-center justify-between text-xs text-brand-900/40">
                        <span className="font-medium text-brand-900/60">₹{n.totalAmount}</span>
                        <span>{timeAgo(n.updatedAt)}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
