import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  title,
  description,
  retryLabel,
  onRetry,
  className
}: ErrorStateProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t("errors.pageUnavailable");
  const resolvedDescription = description ?? t("errors.pageDescription");
  const resolvedRetryLabel = retryLabel ?? t("common.actions.retry");
  return (
    <div className={cn("rounded-lg border border-red-200 bg-red-50 p-6 text-red-900", className)}>
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
        <div>
          <h3 className="font-semibold">{resolvedTitle}</h3>
          <p className="mt-1 text-sm text-red-800">{resolvedDescription}</p>
          {onRetry ? (
            <Button type="button" variant="outline" className="mt-4 border-red-200 bg-white text-red-900 hover:bg-red-100" onClick={onRetry}>
              {resolvedRetryLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
