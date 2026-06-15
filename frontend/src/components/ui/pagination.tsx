import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  return (
    <nav className="flex items-center justify-between gap-3" aria-label={t("common.pageOf", { page, total: Math.max(totalPages, 1) })}>
      <p className="text-sm text-muted-foreground">
        {t("common.pageOf", { page, total: Math.max(totalPages, 1) })}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft className="icon-directional h-4 w-4" />
          {t("common.actions.previous")}
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          {t("common.actions.next")}
          <ChevronRight className="icon-directional h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
