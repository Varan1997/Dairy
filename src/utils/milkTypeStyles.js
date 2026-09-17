// A distinct color per milk type so the product list reads as lively/colorful
// rather than everything sharing the same brand green.
export const milkTypeStyles = {
  cow: {
    label: "Cow Milk",
    icon: "🐄",
    gradient: "from-sky-100 to-sky-50",
    badge: "bg-sky-500 text-white",
    accent: "text-sky-700",
    chipActive: "bg-sky-500 text-white shadow-soft",
  },
  buffalo: {
    label: "Buffalo Milk",
    icon: "🐃",
    gradient: "from-violet-100 to-violet-50",
    badge: "bg-violet-500 text-white",
    accent: "text-violet-700",
    chipActive: "bg-violet-500 text-white shadow-soft",
  },
  toned: {
    label: "Toned",
    icon: "🥛",
    gradient: "from-teal-100 to-teal-50",
    badge: "bg-teal-500 text-white",
    accent: "text-teal-700",
    chipActive: "bg-teal-500 text-white shadow-soft",
  },
  "full-cream": {
    label: "Full Cream",
    icon: "🧈",
    gradient: "from-amber-100 to-amber-50",
    badge: "bg-amber-500 text-white",
    accent: "text-amber-700",
    chipActive: "bg-amber-500 text-white shadow-soft",
  },
  ghee: {
    label: "Ghee",
    icon: "🫙",
    gradient: "from-yellow-100 to-yellow-50",
    badge: "bg-yellow-500 text-white",
    accent: "text-yellow-700",
    chipActive: "bg-yellow-500 text-white shadow-soft",
  },
  other: {
    label: "Dairy",
    icon: "🧀",
    gradient: "from-rose-100 to-rose-50",
    badge: "bg-rose-500 text-white",
    accent: "text-rose-700",
    chipActive: "bg-rose-500 text-white shadow-soft",
  },
};

export const getMilkTypeStyle = (type) => milkTypeStyles[type] || milkTypeStyles.other;
