import { Outlet } from "react-router-dom";

import { MobileBottomNavigation } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen pb-28 xl:pb-10">
      <Navbar />
      <div className="container flex items-start gap-6 py-6">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
      <MobileBottomNavigation />
    </div>
  );
}
