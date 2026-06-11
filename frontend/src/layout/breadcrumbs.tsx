import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { getNavigationItem } from "@/layout/navigation";

export function Breadcrumbs() {
  const location = useLocation();
  const item = getNavigationItem(location.pathname);
  const label = item?.label ?? "Workspace";

  return (
    <nav className="flex min-w-0 items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link to="/" className="shrink-0 text-muted-foreground hover:text-foreground">
        Clinic
      </Link>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate font-medium">{label}</span>
    </nav>
  );
}
