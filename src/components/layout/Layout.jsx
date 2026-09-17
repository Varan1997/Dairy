import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import OrderStatusToasts from "../OrderStatusToasts";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <OrderStatusToasts />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-4 md:pb-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
