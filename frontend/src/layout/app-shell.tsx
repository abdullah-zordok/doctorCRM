import * as React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/layout/sidebar";
import { TopNav } from "@/layout/top-nav";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      <div className="min-h-screen lg:ps-72">
        <TopNav onOpenSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
