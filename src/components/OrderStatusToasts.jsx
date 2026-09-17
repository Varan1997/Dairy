import { useNavigate } from "react-router-dom";
import { useOrderNotifications, orderStatusCopy } from "../context/OrderNotificationContext";

export default function OrderStatusToasts() {
  const notifications = useOrderNotifications();
  const navigate = useNavigate();

  if (!notifications || notifications.toasts.length === 0) return null;
  const { toasts, dismissToast } = notifications;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-[280px] flex-col items-end gap-2">
      {toasts.map((t) => {
        const copy = orderStatusCopy[t.orderStatus] || {
          icon: "📦",
          label: "Order updated",
          iconBg: "bg-brand-100 text-brand-700",
        };
        return (
          <div
            key={t.id}
            className="toast-in flex cursor-pointer items-center gap-2 rounded-full bg-cream-50 py-1.5 pl-1.5 pr-3 shadow-soft-lg ring-1 ring-black/[0.03]"
            onClick={() => {
              dismissToast(t.id);
              navigate(`/orders/${t.orderId}`);
            }}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm ${copy.iconBg}`}
            >
              {copy.icon}
            </span>
            <span className="truncate text-xs font-semibold text-brand-900">{copy.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(t.id);
              }}
              className="ml-0.5 shrink-0 text-brand-900/30 hover:text-brand-900/60"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
