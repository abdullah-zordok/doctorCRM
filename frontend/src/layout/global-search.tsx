import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { StatusChip } from "@/features/shared/status-chip";
import { searchWorkflow } from "@/features/shared/workflow-api";
import { cn } from "@/lib/utils";

function useDebouncedValue(value: string, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debounced;
}

export function GlobalSearch() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query.trim());
  const shouldSearch = debounced.length >= 2;
  const { data, isFetching, isError } = useQuery({
    queryKey: ["global-workflow-search", language, debounced],
    queryFn: () => searchWorkflow(debounced, language),
    enabled: shouldSearch
  });

  const hasResults = Boolean(data?.length);

  return (
    <div className="relative">
      <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("shell.search.placeholder")} aria-label={t("shell.search.label")} className="h-11 bg-card/90" />
      {query ? (
        <div className="absolute inset-x-0 top-13 z-50 overflow-hidden rounded-2xl border bg-popover p-1 shadow-soft">
          {!shouldSearch ? (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              {t("shell.search.minimum")}
            </div>
          ) : isFetching ? (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("shell.search.searching")}
            </div>
          ) : isError ? (
            <div className="rounded-xl px-4 py-3 text-sm text-destructive">{t("shell.search.unavailable")}</div>
          ) : hasResults ? (
            <div className="max-h-80 overflow-y-auto p-1">
              {data?.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.target.href}
                  onClick={() => setQuery("")}
                  className={cn("clinic-focus flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-muted")}
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="outline">{t(`common.recordType.${result.type}`)}</Badge>
                      <StatusChip status={result.status} />
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{result.subtitle}</span>
                  </span>
                  <ArrowRight className="icon-directional h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3 text-sm text-muted-foreground">{t("shell.search.noResults", { query: debounced })}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
