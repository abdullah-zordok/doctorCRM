import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";

type StatePanelProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: () => void;
};

export function WorkflowSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-56 rounded-2xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>
    </div>
  );
}

export function WorkflowLoadingState({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-card/95 p-4 text-sm text-muted-foreground shadow-sm">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label ?? t("common.loading")}
    </div>
  );
}

export function WorkflowEmptyState({ title, description, actionLabel, onAction }: StatePanelProps) {
  return <EmptyState icon={Inbox} title={title} description={description} actionLabel={actionLabel} onAction={onAction} />;
}

export function WorkflowErrorState({ title, description, onRetry }: StatePanelProps) {
  const { t } = useTranslation();
  return <ErrorState title={title} description={description} retryLabel={t("common.actions.retry")} onRetry={onRetry} />;
}

export function InlineStateNotice({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-dashed bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      {label}
    </div>
  );
}
