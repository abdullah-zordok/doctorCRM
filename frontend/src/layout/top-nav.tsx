import { Bell, LogOut, Menu, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/auth-provider";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { Breadcrumbs } from "@/layout/breadcrumbs";
import { GlobalSearch } from "@/layout/global-search";

type TopNavProps = {
  onOpenSidebar: () => void;
};

export function TopNav({ onOpenSidebar }: TopNavProps) {
  const { user, logout } = useAuth();
  const { notify } = useNotifications();

  async function handleLogout() {
    await logout();
    notify({ type: "info", title: "Signed out", description: "Your local session has been cleared." });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="flex min-h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>

        <div className="min-w-0 flex-1">
          <Breadcrumbs />
        </div>

        <div className="hidden w-full max-w-xl md:block">
          <GlobalSearch />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => notify({ type: "info", title: "No new notifications", description: "Notification center is ready for future workflow events." })}
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="h-11 gap-3 rounded-2xl px-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <UserRound className="h-4 w-4" />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-4">{user?.name}</span>
                <span className="block text-xs text-muted-foreground">{user?.role === "DOCTOR" ? "Doctor" : "Secretary"}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <span className="block">{user?.name}</span>
              <span className="block text-xs font-normal text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-border/70 px-4 py-3 md:hidden">
        <GlobalSearch />
      </div>
    </header>
  );
}
