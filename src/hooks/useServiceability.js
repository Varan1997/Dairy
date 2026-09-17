import { useEffect, useState } from "react";
import api from "../api/axios";

const IDLE_STATE = { status: "idle", serviceable: null, city: null, lat: null, lng: null };

// Debounced pincode -> { status: 'idle'|'checking'|'done'|'error', serviceable, city, lat, lng }
export function useServiceability(pincode) {
  const [state, setState] = useState(IDLE_STATE);

  useEffect(() => {
    if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
      setState(IDLE_STATE);
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, status: "checking" }));

    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/serviceability/${pincode}`);
        if (!cancelled) {
          setState({
            status: "done",
            serviceable: res.data.serviceable,
            city: res.data.city,
            lat: res.data.lat,
            lng: res.data.lng,
          });
        }
      } catch {
        if (!cancelled) setState({ status: "error", serviceable: null, city: null, lat: null, lng: null });
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pincode]);

  return state;
}
