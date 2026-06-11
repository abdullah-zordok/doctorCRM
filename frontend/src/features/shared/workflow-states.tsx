import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
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
      <Skeleton className="h-8 w-56" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export function WorkflowLoadingState({ label = "Loading clinic workflow..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function WorkflowEmptyState({ title, description, actionLabel, onAction }: StatePanelProps) {
  return <EmptyState icon={Inbox} title={title} description={description} actionLabel={actionLabel} onAction={onAction} />;
}

export function WorkflowErrorState({ title, description, onRetry }: StatePanelProps) {
  return <ErrorState title={title} description={description} retryLabel="Retry" onRetry={onRetry} />;
}

export function InlineStateNotice({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      {label}
    </div>
  );
}
