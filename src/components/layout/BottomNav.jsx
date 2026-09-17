import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const items = [
  {
    to: "/products",
    label: "Shop",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 4h6l1.5 4H7.5L9 4zM4 8h16l-1.5 12a2 2 0 01-2 2H7.5a2 2 0 01-2-2L4 8zM9 12v3M15 12v3"
      />
    ),
  },
  {
    to: "/orders",
    label: "Orders",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 7h6m-6 4h6"
      />
    ),
  },
  {
    to: "/subscriptions",
    label: "Subscribe",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
  },
  {
    to: "/cart",
    label: "Cart",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    ),
  },
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
  },
];

export default function BottomNav() {
  const { user } = useAuth();
  const { count } = useCart();

  if (!user) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-900/[0.06] bg-cream-50/95 shadow-[0_-8px_24px_-16px_rgba(36,57,27,0.25)] backdrop-blur-md md:hidden">
      <div className="flex h-[4.25rem] items-stretch justify-around px-1 pb-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                isActive ? "text-brand-700" : "text-brand-900/45"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`hover-scale flex h-8 w-12 items-center justify-center rounded-full ${
                    isActive ? "bg-brand-100" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {item.icon}
                  </svg>
                </span>
                {item.label}
                {item.to === "/cart" && count > 0 && (
                  <span className="absolute right-3 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
