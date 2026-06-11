import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
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
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query.trim());
  const shouldSearch = debounced.length >= 2;
  const { data, isFetching, isError } = useQuery({
    queryKey: ["global-workflow-search", debounced],
    queryFn: () => searchWorkflow(debounced),
    enabled: shouldSearch
  });

  const hasResults = Boolean(data?.length);

  return (
    <div className="relative">
      <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients, appointments, visits" aria-label="Global workflow search" />
      {query ? (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-lg border bg-popover shadow-soft">
          {!shouldSearch ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              Type at least 2 characters
            </div>
          ) : isFetching ? (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching clinic records...
            </div>
          ) : isError ? (
            <div className="px-4 py-3 text-sm text-destructive">Clinic search is temporarily unavailable.</div>
          ) : hasResults ? (
            <div className="max-h-80 overflow-y-auto p-1">
              {data?.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.target.href}
                  onClick={() => setQuery("")}
                  className={cn("clinic-focus flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-muted")}
                >
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="outline">{result.type}</Badge>
                      <StatusChip status={result.status} />
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{result.subtitle}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">No clinic records match "{debounced}".</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
