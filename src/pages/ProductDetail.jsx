import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AddressForm from "../components/AddressForm";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getMilkTypeStyle } from "../utils/milkTypeStyles";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [packSizeId, setPackSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const [showSubscribe, setShowSubscribe] = useState(false);
  const [subAddress, setSubAddress] = useState({});
  const [subAddressServiceability, setSubAddressServiceability] = useState({ status: "idle" });
  const [subPaymentMethod, setSubPaymentMethod] = useState("COD");
  const [subStartDate, setSubStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [subLoading, setSubLoading] = useState(false);
  const [subMessage, setSubMessage] = useState("");

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setPackSizeId(res.data.packSizes[0]?._id || "");
      })
      .catch(() => setError("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Prefill from the default saved address exactly once — see the same guard
  // in Checkout.jsx for why (AuthContext's background refresh would otherwise
  // wipe out anything typed since).
  const prefilledAddress = useRef(false);
  useEffect(() => {
    if (user?.addresses?.length && !prefilledAddress.current) {
      prefilledAddress.current = true;
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSubAddress({
        houseNumber: def.houseNumber,
        street: def.street,
        landmark: def.landmark,
        city: def.city,
        pincode: def.pincode,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="aspect-square w-full animate-pulse rounded-3xl bg-brand-100 lg:w-1/2" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-2/3 animate-pulse rounded bg-brand-100" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-brand-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-brand-100" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-4xl">
          ⚠️
        </span>
        <p className="text-red-600">{error || "Product not found"}</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const selectedPack = product.packSizes.find((p) => p._id === packSizeId);
  const style = getMilkTypeStyle(product.milkType);

  const handleAddToCart = () => {
    if (!selectedPack) return;
    addItem({
      productId: product._id,
      productName: product.name,
      image: product.image,
      milkType: product.milkType,
      packSizeId: selectedPack._id,
      size: selectedPack.size,
      price: selectedPack.price,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubMessage("");

    if (!subAddress.houseNumber || !subAddress.street || !subAddress.city || !subAddress.pincode) {
      setSubMessage("Please fill in the full delivery address");
      return;
    }

    if (subAddressServiceability.status === "done" && !subAddressServiceability.serviceable) {
      setSubMessage("Sorry, we don't deliver to this pincode yet");
      return;
    }

    setSubLoading(true);
    try {
      await api.post("/subscriptions", {
        product: product._id,
        packSizeId: selectedPack._id,
        quantity,
        deliveryAddress: subAddress,
        paymentMethod: subPaymentMethod,
        startDate: subStartDate,
      });
      navigate("/subscriptions");
    } catch (err) {
      setSubMessage(err.response?.data?.message || "Failed to create subscription");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <Link
        to="/products"
        className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-soft lg:w-1/2"
      >
        <div className={`h-full w-full bg-gradient-to-br ${style.gradient}`}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-14 -right-10 h-48 w-48 rounded-full bg-white/30 blur-3xl" />
              <div className="flex h-full w-full items-center justify-center">
                <span className="flex h-28 w-28 items-center justify-center rounded-full bg-white/80 text-6xl shadow-soft ring-1 ring-white/60 backdrop-blur">
                  {style.icon}
                </span>
              </div>
            </>
          )}
        </div>
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-soft ${style.badge}`}
        >
          {style.icon} {style.label}
        </span>
        {product.subscriptionAvailable && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-400/95 px-2.5 py-1 text-xs font-semibold text-[#24391b] shadow-soft">
            Subscribe & Save
          </span>
        )}
      </Link>

      <div className="flex-1">
        <h1 className="font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
          {product.name}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-900/55">{product.description}</p>

        {selectedPack && (
          <p className={`font-display mt-4 text-3xl font-semibold ${style.accent}`}>
            ₹{selectedPack.price}
            <span className="ml-1.5 text-sm font-sans font-normal text-brand-900/40">
              / {selectedPack.size}
            </span>
          </p>
        )}

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-900/40">
              Pack Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.packSizes.map((pack) => (
                <button
                  key={pack._id}
                  type="button"
                  onClick={() => setPackSizeId(pack._id)}
                  className={`hover-pop rounded-full border px-4 py-1.5 text-sm font-semibold ${
                    pack._id === packSizeId
                      ? "border-transparent bg-[#24391b] text-white shadow-soft"
                      : "border-brand-900/10 bg-cream-50 text-brand-900/60 hover:border-brand-300 hover:text-brand-900"
                  }`}
                >
                  {pack.size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-brand-900/40">
              Quantity
            </p>
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-900/10 bg-cream-50 px-2 py-1.5 shadow-soft">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="hover-scale flex h-8 w-8 items-center justify-center rounded-full text-lg text-brand-900/70 hover:bg-brand-50"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-brand-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="hover-scale flex h-8 w-8 items-center justify-center rounded-full text-lg text-brand-900/70 hover:bg-brand-50"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleAddToCart}
            className={`btn ${added ? "bg-brand-800 text-white" : "btn-primary"}`}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

          {product.subscriptionAvailable && (
            <button onClick={() => setShowSubscribe((s) => !s)} className="btn btn-outline">
              {showSubscribe ? "Cancel Subscription Setup" : "Subscribe for Daily Delivery"}
            </button>
          )}
        </div>

        {showSubscribe && (
          <form onSubmit={handleSubscribe} className="card mt-5 flex flex-col gap-4 p-4">
            <h2 className="font-display font-semibold text-brand-900">
              Set up daily subscription
            </h2>

            <div>
              <label className="mb-1 block text-sm font-medium text-brand-900/80">
                Start Date
              </label>
              <input
                type="date"
                value={subStartDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setSubStartDate(e.target.value)}
                className="input max-w-xs"
              />
            </div>

            <AddressForm
              value={subAddress}
              onChange={setSubAddress}
              onServiceabilityChange={setSubAddressServiceability}
            />

            <div>
              <label className="mb-1 block text-sm font-medium text-brand-900/80">
                Payment Method
              </label>
              <div className="flex gap-4 text-sm text-brand-900/80">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={subPaymentMethod === "COD"}
                    onChange={() => setSubPaymentMethod("COD")}
                    className="accent-brand-600"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={subPaymentMethod === "ONLINE"}
                    onChange={() => setSubPaymentMethod("ONLINE")}
                    className="accent-brand-600"
                  />
                  Online (pay per delivery order)
                </label>
              </div>
            </div>

            {subMessage && <p className="text-sm text-red-600">{subMessage}</p>}

            <button
              type="submit"
              disabled={
                subLoading ||
                (subAddressServiceability.status === "done" && !subAddressServiceability.serviceable)
              }
              className="btn btn-primary"
            >
              {subLoading ? "Setting up..." : "Confirm Subscription"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
