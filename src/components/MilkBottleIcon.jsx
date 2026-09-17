export default function MilkBottleIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10 2.5h4v2.6l1.4 2.1c.4.6.6 1.3.6 2V19a2.5 2.5 0 01-2.5 2.5h-3A2.5 2.5 0 018 19V9.2c0-.7.2-1.4.6-2L10 5.1V2.5z"
        className="fill-white/90"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path d="M8.3 12.5h7.4" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      <rect x="9.4" y="2.5" width="5.2" height="2" rx="0.6" className="fill-current" />
      <path
        d="M9.3 14.6c.9.5 1.6.5 2.5 0s1.6-.5 2.5 0 1.6.5 2.5 0"
        className="stroke-gold-500"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}
