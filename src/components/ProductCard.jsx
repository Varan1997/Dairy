import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getMilkTypeStyle } from "../utils/milkTypeStyles";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [packSizeId, setPackSizeId] = useState(product.packSizes[0]?._id);
  const [added, setAdded] = useState(false);

  const selectedPack = product.packSizes.find((p) => p._id === packSizeId);
  const style = getMilkTypeStyle(product.milkType);

  const handleAdd = () => {
    if (!selectedPack) return;
    addItem({
      productId: product._id,
      productName: product.name,
      image: product.image,
      milkType: product.milkType,
      packSizeId: selectedPack._id,
      size: selectedPack.size,
      price: selectedPack.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-soft-lg">
      <Link
        to={`/products/${product._id}`}
        className={`relative aspect-square w-full overflow-hidden bg-gradient-to-br ${style.gradient}`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
            <div className="flex h-full w-full items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-3xl shadow-soft ring-1 ring-white/60 backdrop-blur transition duration-300 group-hover:scale-110 sm:h-20 sm:w-20 sm:text-4xl">
                {style.icon}
              </span>
            </div>
          </>
        )}
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-soft ${style.badge}`}
        >
          {style.icon} {style.label}
        </span>
        
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link
          to={`/products/${product._id}`}
          className="font-display font-semibold leading-snug text-brand-900"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-brand-900/50">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {product.packSizes.map((pack) => (
            <button
              key={pack._id}
              type="button"
              onClick={() => setPackSizeId(pack._id)}
              className={`hover-pop rounded-full border px-2.5 py-1 text-xs font-semibold ${
                pack._id === packSizeId
                  ? "border-transparent bg-[#24391b] text-white shadow-soft"
                  : "border-brand-900/10 bg-cream-50 text-brand-900/60 hover:border-brand-300 hover:text-brand-900"
              }`}
            >
              {pack.size}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          {selectedPack && (
            <p className={`font-display text-lg font-semibold ${style.accent}`}>
              ₹{selectedPack.price}
              <span className="ml-1 text-xs font-sans font-normal text-brand-900/40">
                / {selectedPack.size}
              </span>
            </p>
          )}

          <button
            onClick={handleAdd}
            className={`btn shrink-0 !px-3 !py-2 text-sm ${added ? "bg-brand-800 text-white" : "btn-primary"}`}
          >
            {added ? "Added ✓" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}
