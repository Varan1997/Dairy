import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <p className="text-4xl">🤔</p>
      <h1 className="font-display text-xl font-semibold text-brand-900">Page not found</h1>
      <Link to="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  );
}
