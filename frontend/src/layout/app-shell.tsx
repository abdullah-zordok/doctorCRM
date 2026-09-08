import * as React from "react";
import { Outlet } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Sidebar } from "@/layout/sidebar";
import { TopNav } from "@/layout/top-nav";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-xs sm:text-sm font-medium text-amber-950 dark:text-amber-100 backdrop-blur-md">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <span>
          هذا المشروع <strong>demo</strong> من المشروع الأصلي، هذا المشروع <strong>demo فقط للتجربة</strong> | This project is a <strong>demo</strong> of the original project, for testing only.
        </span>
      </div>
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
