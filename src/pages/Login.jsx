import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AddressForm from "../components/AddressForm";
import MilkingAnimation from "../components/MilkingAnimation";
import FloatingMilkBubbles from "../components/FloatingMilkBubbles";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const PHONE_REGEX = /^[0-9]{10}$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("phone"); // phone -> otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState({});
  const [addressServiceability, setAddressServiceability] = useState({ status: "idle" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Tick the resend cooldown down every second while on the OTP step.
  useEffect(() => {
    if (step !== "otp") return;
    const timer = setInterval(() => {
      setResendCooldown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const sendOtpCore = async () => {
    setError("");
    try {
      const res = await api.post("/auth/send-otp", { phone });
      setDevOtp(res.data.devOtp || "");
      setResendCooldown(30);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      return false;
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!PHONE_REGEX.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    const sent = await sendOtpCore();
    setLoading(false);
    if (sent) setStep("otp");
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;
    setOtp("");
    setResending(true);
    await sendOtpCore();
    setResending(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    if (
      isNewUser &&
      (!name || !address.houseNumber || !address.street || !address.city || !address.pincode)
    ) {
      setError("Please fill in your name and full address to register");
      return;
    }

    if (isNewUser && addressServiceability.status === "done" && addressServiceability.serviceable === false) {
      setError("Sorry, we don't deliver to this pincode yet. Try a different address.");
      return;
    }

    setLoading(true);
    try {
      const payload = { phone, otp };
      if (isNewUser) {
        payload.name = name;
        payload.address = address;
      }
      const res = await api.post("/auth/verify-otp", payload);
      login(res.data.token, res.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";
      if (message.toLowerCase().includes("name and full address")) {
        setIsNewUser(true);
        setError("");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-cream-50">
      <div className="fixed right-4 top-4 z-20">
        <ThemeToggle />
      </div>
      {/* Milk content panel — desktop only */}
      <div className="hero-gradient relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-gold-400/20 blur-3xl" />
        <FloatingMilkBubbles variant="dark" />

        <div className="relative">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-2xl backdrop-blur">
            🥛
          </span>
          <h1 className="font-display mt-8 max-w-md text-4xl font-semibold leading-tight">
            Pure, farm-fresh milk delivered to your door every morning
          </h1>
          <p className="mt-4 max-w-sm text-white/75">
            Sourced straight from trusted local farms and chilled within hours of milking — no
            preservatives, no additives, just real milk the way it should taste.
          </p>

          <ul className="mt-9 flex flex-col gap-4">
            {[
              { icon: "🌿", label: "100% Pure & Natural — zero preservatives or additives" },
              { icon: "🧊", label: "Chilled within hours of milking to lock in freshness" },
              { icon: "🧪", label: "Every batch lab-tested for purity and fat content" },
              { icon: "🔁", label: "Flexible daily subscriptions — pause, skip or adjust anytime" },
            ].map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
                  {f.icon}
                </span>
                <span className="text-sm text-white/85">{f.label}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <MilkingAnimation />
          </div>
        </div>

        <div className="relative flex gap-10 border-t border-white/15 pt-6">
          {[
            { value: "10k+", label: "Happy Families" },
            { value: "100%", label: "Farm Fresh" },
            { value: "24h", label: "Farm to Door" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Login form panel */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#e3ecdd] via-[#fbfaf7] to-[#fdf8ec] px-4 py-10 lg:w-1/2 lg:bg-none">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-300/30 blur-3xl lg:hidden" />
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-gold-300/40 blur-3xl lg:hidden" />
        <FloatingMilkBubbles variant="light" />

        <div className="relative mb-6 text-center lg:hidden">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brand-700 shadow-soft backdrop-blur">
            🥛 Farm to doorstep
          </span>
          <span className="mx-auto mb-3 mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-2xl text-white shadow-soft">
            🥛
          </span>
          <h1 className="font-display text-2xl font-semibold text-[#24391b]">Fresh Dairy</h1>
          <p className="mt-1 text-sm text-[#24391b]/60">
            Pure, farm-fresh milk — delivered to your door every morning.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {[
              { icon: "🔒", label: "Secure OTP Login" },
              { icon: "⚡", label: "No Passwords" },
              { icon: "🚚", label: "Daily Delivery" },
            ].map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft"
              >
                <span aria-hidden>{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="card p-6">
          {step === "phone" && (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-brand-900/80">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile number"
                  className="input"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              {!isNewUser && (
                <>
                  <div>
                    <p className="text-sm text-brand-900/60">
                      OTP sent to <span className="font-medium text-brand-900">{phone}</span>{" "}
                      <button
                        type="button"
                        onClick={() => setStep("phone")}
                        className="font-medium text-brand-600 underline underline-offset-2"
                      >
                        change
                      </button>
                    </p>
                    <p className="mt-1 text-xs text-brand-900/50">
                      Didn't get it?{" "}
                      {resendCooldown > 0 ? (
                        <span>Resend OTP in {resendCooldown}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={resending}
                          className="font-medium text-brand-600 underline underline-offset-2 disabled:opacity-60"
                        >
                          {resending ? "Resending..." : "Resend OTP"}
                        </button>
                      )}
                    </p>
                    {devOtp && (
                      <p className="mt-2 rounded-lg bg-gold-50 px-3 py-1.5 text-xs text-gold-700">
                        DEV MODE — your OTP is <b>{devOtp}</b>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brand-900/80">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit OTP"
                      className="input text-center text-lg tracking-[0.3em]"
                    />
                  </div>
                </>
              )}

              {isNewUser && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-brand-900/60">
                    Looks like you're new here — just need a few details to finish setting up{" "}
                    <span className="font-medium text-brand-900">{phone}</span>.
                  </p>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brand-900/80">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                    />
                  </div>
                  <AddressForm
                    value={address}
                    onChange={setAddress}
                    onServiceabilityChange={setAddressServiceability}
                  />
                </div>
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={
                  loading ||
                  (isNewUser && addressServiceability.status === "done" && !addressServiceability.serviceable)
                }
                className="btn btn-primary w-full"
              >
                {loading ? "Verifying..." : isNewUser ? "Create Account" : "Verify & Login"}
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
