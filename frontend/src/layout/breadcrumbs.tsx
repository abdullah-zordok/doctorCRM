import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNavigationItem } from "@/layout/navigation";

export function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();
  const item = getNavigationItem(location.pathname);
  const label = item ? t(item.labelKey) : t("app.workspace");

  return (
    <nav className="flex min-w-0 items-center gap-2 text-sm" aria-label={t("navigation.breadcrumb")}>
      <Link to="/" className="clinic-focus shrink-0 rounded-md px-1 text-muted-foreground hover:text-foreground">
        {t("app.clinic")}
      </Link>
      <ChevronRight className="icon-directional h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="truncate rounded-full bg-card px-3 py-1 font-semibold shadow-sm">{label}</span>
    </nav>
  );
}
