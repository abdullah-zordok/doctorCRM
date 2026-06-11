import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { SearchInput } from "@/components/ui/search-input";
import { api } from "@/lib/api-client";
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
    queryKey: ["global-patient-search", debounced],
    queryFn: () => api.searchPatients(debounced),
    enabled: shouldSearch
  });

  const hasResults = Boolean(data?.items.length);

  return (
    <div className="relative">
      <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients by name or phone" aria-label="Global patient search" />
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
              Searching patients...
            </div>
          ) : isError ? (
            <div className="px-4 py-3 text-sm text-destructive">Patient search is temporarily unavailable.</div>
          ) : hasResults ? (
            <div className="max-h-80 overflow-y-auto p-1">
              {data?.items.map((patient) => (
                <Link
                  key={patient.id}
                  to={`/patients/${patient.id}`}
                  onClick={() => setQuery("")}
                  className={cn("clinic-focus flex items-center justify-between rounded-md px-3 py-2 text-sm transition hover:bg-muted")}
                >
                  <span>
                    <span className="block font-medium">{patient.name}</span>
                    <span className="block text-xs text-muted-foreground">{patient.phone}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-muted-foreground">No patients match "{debounced}".</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
