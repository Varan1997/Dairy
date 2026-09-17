const styles = {
  placed: "bg-cream-200 text-brand-900/70",
  confirmed: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-gold-100 text-gold-700",
  delivered: "bg-brand-100 text-brand-700",
  cancelled: "bg-red-100 text-red-700",
};

const labels = {
  placed: "Placed",
  confirmed: "Confirmed",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const icons = {
  placed: "🧾",
  confirmed: "✅",
  out_for_delivery: "🚚",
  delivered: "🎉",
  cancelled: "✕",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-soft ${
        styles[status] || "bg-cream-200 text-brand-900/70"
      }`}
    >
      <span aria-hidden>{icons[status] || "📦"}</span>
      {labels[status] || status}
    </span>
  );
}
