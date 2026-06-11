import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description = "The content could not be loaded. Please try again.",
  retryLabel = "Try again",
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-6 text-red-900", className)}>
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-red-800">{description}</p>
          {onRetry ? (
            <Button type="button" variant="outline" className="mt-4 border-red-200 bg-white text-red-900 hover:bg-red-100" onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
