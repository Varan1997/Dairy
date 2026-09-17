import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import NotificationBell from "../NotificationBell";
import ThemeToggle from "../ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/[0.06] bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="hover-scale flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-lg shadow-soft">
            🥛
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-brand-900">
            Fresh Dairy
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-brand-900/70 md:flex">
          <Link to="/products" className="nav-link transition hover:text-brand-700">
            Products
          </Link>
          {user && (
            <>
              <Link to="/orders" className="nav-link transition hover:text-brand-700">
                My Orders
              </Link>
              <Link to="/subscriptions" className="nav-link transition hover:text-brand-700">
                Subscriptions
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && <NotificationBell />}
          <Link
            to="/cart"
            className="hover-scale relative flex h-10 w-10 items-center justify-center rounded-full text-brand-900/70 hover:bg-brand-100 hover:text-brand-800"
            aria-label="Cart"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293A1 1 0 005.414 17H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/profile"
                className="text-sm font-medium text-brand-900/70 transition hover:text-brand-700"
              >
                {user.name || user.phone}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary !py-1.5">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary hidden !py-1.5 md:inline-flex">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
