import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { useSecretaryDashboard } from "@/features/dashboards/dashboard.api";
import { SecretaryDashboardContent } from "@/features/dashboards/secretary-dashboard-widgets";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";

export function SecretaryDashboardPage() {
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = useSecretaryDashboard();

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data) {
    return <WorkflowErrorState title="Secretary dashboard unavailable" description="The reception view could not be loaded." onRetry={() => void refetch()} />;
  }

  if (!data.items.length) {
    return (
      <WorkflowEmptyState
        title="No reception tasks"
        description="There are no appointments, registrations, or queue items right now."
        actionLabel="Refresh dashboard"
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Secretary workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">Front desk priorities for today</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The dashboard keeps booking, registration, and patient lookup available without extra navigation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}>Register patient</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}>Book appointment</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "info", title: "Secretary dashboard ready", description: "Reception queue, search, and quick actions are loaded." })}
            >
              Test alert
            </Button>
          </div>
        </div>
      </section>

      <SecretaryDashboardContent summary={data} />
    </div>
  );
}
