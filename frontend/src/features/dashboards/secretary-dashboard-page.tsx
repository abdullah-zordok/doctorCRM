import { CalendarPlus, UserPlus } from "lucide-react";
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
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="clinic-kicker">Front desk workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Reception priorities for today</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The dashboard keeps booking, registration, and patient lookup available without extra navigation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}><UserPlus className="h-4 w-4" /> Register patient</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}><CalendarPlus className="h-4 w-4" /> Book appointment</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "info", title: "Secretary dashboard ready", description: "Reception queue, search, and quick actions are loaded." })}
            >
              Check reception
            </Button>
          </div>
        </div>
      </section>

      <SecretaryDashboardContent summary={data} />
    </div>
  );
}
