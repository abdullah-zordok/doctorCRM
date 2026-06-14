import * as React from "react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <div className="relative">
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
    <Input ref={ref} className={cn("pl-10", className)} type="search" {...props} />
  </div>
));
SearchInput.displayName = "SearchInput";
