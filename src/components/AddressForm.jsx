import { useEffect, useState } from "react";
import { useServiceability } from "../hooks/useServiceability";
import { distanceKm } from "../utils/distance";
import LocationMap from "./LocationMap";

// Indian pincodes typically span a few km (dense urban) up to ~15-20km (rural).
// This is a generous ceiling meant to catch "wrong city" mistakes, not to be a
// precise pincode boundary.
const MAX_PIN_DISTANCE_KM = 20;

const fields = [
  { name: "houseNumber", label: "House / Flat No.", placeholder: "e.g. 12-A" },
  { name: "street", label: "Street", placeholder: "e.g. MG Road" },
  { name: "landmark", label: "Landmark (optional)", placeholder: "e.g. Near Bus Stop" },
  { name: "city", label: "City", placeholder: "e.g. Bengaluru" },
  { name: "pincode", label: "Pincode", placeholder: "e.g. 560001" },
];

export default function AddressForm({ value, onChange, onServiceabilityChange, showLocationCapture }) {
  const serviceability = useServiceability(value.pincode);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | locating | done | error | unsupported
  const [userAdjustedPin, setUserAdjustedPin] = useState(false);
  const [locationWarning, setLocationWarning] = useState("");

  const farFromPincode = (lat, lng) => {
    if (serviceability.lat == null || serviceability.lng == null) return false;
    return distanceKm(lat, lng, serviceability.lat, serviceability.lng) > MAX_PIN_DISTANCE_KM;
  };

  useEffect(() => {
    onServiceabilityChange?.(serviceability);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceability.status, serviceability.serviceable]);

  // Once we know the pincode's serviceable area, use its coordinates as the map's
  // starting point instead of a generic hardcoded city — much closer to the real
  // address than nothing. The user still drags the pin to their exact house from there.
  useEffect(() => {
    if (
      showLocationCapture &&
      serviceability.status === "done" &&
      serviceability.serviceable &&
      serviceability.lat != null &&
      serviceability.lng != null
    ) {
      onChange((prev) =>
        prev.location ? prev : { ...prev, location: { lat: serviceability.lat, lng: serviceability.lng } }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLocationCapture, serviceability.status, serviceability.serviceable, serviceability.lat, serviceability.lng]);

  const handleChange = (name, val) => {
    if (name === "pincode") setLocationWarning("");
    onChange({ ...value, [name]: val });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        onChange({ ...value, location: { lat, lng, accuracy: Math.round(accuracy) } });
        setLocationStatus("done");
        setUserAdjustedPin(true);
        setLocationWarning(
          farFromPincode(lat, lng)
            ? "Your device's current location looks far from this pincode's area — double check the pincode is correct."
            : ""
        );
      },
      () => setLocationStatus("error"),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleMapChange = ({ lat, lng }) => {
    if (farFromPincode(lat, lng)) {
      setLocationWarning(
        `That spot looks too far from pincode ${value.pincode}'s area. Drag the pin somewhere closer, or double-check the pincode.`
      );
      return false;
    }
    setLocationWarning("");
    onChange({ ...value, location: { lat, lng } });
    setLocationStatus("done");
    setUserAdjustedPin(true);
    return true;
  };

  return (
    <div className="flex flex-col gap-3">
      {showLocationCapture && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-medium text-brand-900/80">Pin your exact location</label>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locationStatus === "locating"}
              className="btn btn-outline !py-1.5 text-xs disabled:opacity-60"
            >
              📍 {locationStatus === "locating" ? "Locating..." : "Use current location"}
            </button>
          </div>

          <LocationMap
            lat={value.location?.lat}
            lng={value.location?.lng}
            onChange={handleMapChange}
            editable
          />
          <p className="text-[11px] text-brand-900/35">
            Satellite imagery may look blurry or empty in some areas — that's a coverage limit of the free
            imagery provider outside major cities.
          </p>

          {locationWarning && (
            <p className="rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-700">⚠️ {locationWarning}</p>
          )}

          <div className="min-h-4 text-xs">
            {locationStatus === "idle" && !value.location && (
              <span className="text-brand-900/40">
                Tap the button or click/drag the pin on the map to mark exactly where to deliver.
              </span>
            )}
            {locationStatus === "locating" && (
              <span className="text-brand-900/40">Getting your location...</span>
            )}
            {value.location && !userAdjustedPin && (
              <span className="text-gold-600">
                📍 Starting near your pincode's area — drag the pin to your exact house.
              </span>
            )}
            {value.location && userAdjustedPin && (
              <span className={value.location.accuracy > 100 ? "text-gold-600" : "text-brand-600"}>
                ✓ Location pinned
                {value.location.accuracy ? ` (GPS accuracy ±${value.location.accuracy}m)` : ""} — drag the pin to
                fine-tune it.
              </span>
            )}
            {locationStatus === "error" && (
              <span className="text-red-600">
                Couldn't get your location. Check browser permissions, or just drag the pin on the map.
              </span>
            )}
            {locationStatus === "unsupported" && (
              <span className="text-red-600">
                GPS isn't supported on this browser — you can still drag the pin on the map.
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.name === "street" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium text-brand-900/80">{field.label}</label>
            <input
              type="text"
              required={field.name !== "landmark"}
              value={value[field.name] || ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="input"
            />
            {field.name === "pincode" && (
              <div className="mt-1 min-h-4 text-xs">
                {serviceability.status === "checking" && (
                  <span className="text-brand-900/40">Checking delivery availability...</span>
                )}
                {serviceability.status === "done" && serviceability.serviceable && (
                  <span className="text-brand-600">✓ We deliver to {serviceability.city || "this area"}</span>
                )}
                {serviceability.status === "done" && !serviceability.serviceable && (
                  <span className="text-red-600">✗ Sorry, we don't deliver to this pincode yet</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
