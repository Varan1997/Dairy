import { Link } from "react-router-dom";

const trustBadges = [
  { icon: "🌿", label: "100% Pure, No Preservatives" },
  { icon: "🚚", label: "Delivered Fresh Every Morning" },
  { icon: "🔁", label: "Skip or Pause Anytime" },
];

export default function Home() {
  return (
    <div className="hero-gradient-light relative overflow-hidden rounded-3xl px-6 py-14 text-white shadow-soft-lg sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-gold-400/20 blur-3xl" />

      <div className="relative max-w-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
          🥛 Farm to doorstep
        </span>
        <h1 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Farm-fresh milk, delivered every morning
        </h1>
        <p className="mt-3 text-sm text-brand-50/90 sm:text-base">
          Order a one-time pack or subscribe for daily delivery straight to your door — pause,
          skip, or adjust anytime.
        </p>

        <Link
          to="/products"
          className="btn mt-6 bg-white text-brand-700 shadow-soft hover:bg-cream-50"
        >
          Shop Products
        </Link>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-2.5">
        {trustBadges.map((badge) => (
          <span
            key={badge.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur"
          >
            <span aria-hidden>{badge.icon}</span>
            {badge.label}
          </span>
        ))}
      </div>
    </div>
  );
}
