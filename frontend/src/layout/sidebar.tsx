import { Activity, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { getNavigationForRole, isNavigationItemActive } from "@/layout/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const items = user ? getNavigationForRole(user.role) : [];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Activity className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold">Doctor Clinic</p>
            <p className="text-xs text-muted-foreground">Clinic workspace</p>
          </div>
        </div>
        <Button type="button" size="icon" variant="ghost" className="lg:hidden" onClick={() => onMobileOpenChange(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close navigation</span>
        </Button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => (
          <Link
            key={`${item.path}-${item.label}`}
            to={item.path}
            onClick={() => onMobileOpenChange(false)}
            className={cn(
              "clinic-focus flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
              isNavigationItemActive(item, location.pathname) && "bg-secondary text-secondary-foreground"
            )}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-secondary-foreground">SPEC 01</p>
            <Badge variant="secondary">Shell</Badge>
          </div>
          <p className="mt-2 text-xs leading-5 text-secondary-foreground/80">Clinic workflow pages are live for daily dashboard, patient, visit, prescription, and appointment work.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r bg-card lg:block">{content}</aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-slate-950/40" onClick={() => onMobileOpenChange(false)} />
          <aside className="relative h-full w-[min(22rem,85vw)] border-r bg-card shadow-soft">{content}</aside>
        </div>
      ) : null}
    </>
  );
}
