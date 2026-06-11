import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { DoctorDashboardContent } from "@/features/dashboards/dashboard-widgets";
import { useDoctorDashboard } from "@/features/dashboards/dashboard.api";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowLoadingState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";

export function DoctorDashboardPage() {
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = useDoctorDashboard();

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data) {
    return <WorkflowErrorState title="Doctor dashboard unavailable" description="The clinical work queue could not be loaded." onRetry={() => void refetch()} />;
  }

  if (!data.items.length) {
    return (
      <WorkflowEmptyState
        title="No active work queue"
        description="There are no waiting patients or open visits right now."
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
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Doctor workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">Clinical priorities for today</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Waiting patients and active consultations stay in front. Analytics stay visible but secondary.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}>Open patients</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}>Review schedule</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "success", title: "Doctor dashboard ready", description: "Queue, analytics, and quick actions are loaded." })}
            >
              Test alert
            </Button>
          </div>
        </div>
      </section>

      <Card className="border-dashed">
        <CardContent className="p-4">
          <WorkflowLoadingState label="Live dashboard data is ready for clinic operations." />
        </CardContent>
      </Card>

      <DoctorDashboardContent summary={data} />
    </div>
  );
}
