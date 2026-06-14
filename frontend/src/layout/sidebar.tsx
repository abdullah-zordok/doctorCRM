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
      <div className="flex h-24 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Activity className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight">Doctor Clinic</p>
            <p className="text-xs font-medium text-muted-foreground">Premium care workspace</p>
          </div>
        </div>
        <Button type="button" size="icon" variant="ghost" className="lg:hidden" onClick={() => onMobileOpenChange(false)}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close navigation</span>
        </Button>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-2">
        {items.map((item) => (
          <Link
            key={`${item.path}-${item.label}`}
            to={item.path}
            onClick={() => onMobileOpenChange(false)}
            className={cn(
              "clinic-focus flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground",
              isNavigationItemActive(item, location.pathname) && "bg-secondary text-secondary-foreground shadow-sm"
            )}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border/70 p-4">
        <div className="rounded-2xl bg-secondary/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-secondary-foreground">SPEC 03</p>
            <Badge variant="secondary">UI Kit</Badge>
          </div>
          <p className="mt-2 text-xs leading-5 text-secondary-foreground/80">Visual system refined for daily clinic work across dashboard, patient, visit, and appointment screens.</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border/70 bg-card/95 backdrop-blur lg:block">{content}</aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-slate-950/40" onClick={() => onMobileOpenChange(false)} />
          <aside className="relative h-full w-[min(22rem,85vw)] border-r bg-card shadow-soft">{content}</aside>
        </div>
      ) : null}
    </>
  );
}
