import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobileNav from "@/components/layout/MobileNav";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          "md:pl-64",
        )}
      >
        <MobileNav onOpenSidebar={() => setSidebarOpen(true)} />
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
