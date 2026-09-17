import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const OrderNotificationContext = createContext(null);

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:5000" : window.location.origin;

const STATUS_COPY = {
  confirmed: {
    icon: "✅",
    label: "Order confirmed",
    sub: "Your order has been accepted and is being prepared.",
    ring: "ring-blue-200",
    iconBg: "bg-blue-100 text-blue-700",
    accent: "bg-blue-500",
  },
  out_for_delivery: {
    icon: "🚚",
    label: "Out for delivery",
    sub: "Your milk is on its way to you.",
    ring: "ring-gold-200",
    iconBg: "bg-gold-100 text-gold-700",
    accent: "bg-gold-500",
  },
  delivered: {
    icon: "🎉",
    label: "Delivered",
    sub: "Enjoy your fresh dairy!",
    ring: "ring-brand-200",
    iconBg: "bg-brand-100 text-brand-700",
    accent: "bg-brand-600",
  },
  cancelled: {
    icon: "✕",
    label: "Order cancelled",
    sub: "This order has been cancelled.",
    ring: "ring-red-200",
    iconBg: "bg-red-100 text-red-700",
    accent: "bg-red-500",
  },
};

export function OrderNotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on("order_status_update", (payload) => {
      const notification = { ...payload, id: `${payload.orderId}-${Date.now()}`, read: false };

      setNotifications((prev) => [notification, ...prev].slice(0, 30));
      setUnreadCount((c) => c + 1);

      setToasts((prev) => [...prev, notification]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== notification.id));
      }, 6000);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <OrderNotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, toasts, dismissToast }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
}

export const useOrderNotifications = () => useContext(OrderNotificationContext);
export const orderStatusCopy = STATUS_COPY;
