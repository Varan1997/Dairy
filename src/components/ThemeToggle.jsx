import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const themeCtx = useTheme();
  if (!themeCtx) return null;
  const { theme, toggleTheme } = themeCtx;
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="hover-scale relative flex h-10 w-10 items-center justify-center rounded-full text-brand-900/70 hover:bg-brand-100 hover:text-brand-800"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="theme-icon-pop text-lg" key={theme}>
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
