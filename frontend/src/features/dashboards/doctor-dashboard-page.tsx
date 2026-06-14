import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarDays, Stethoscope } from "lucide-react";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { DoctorDashboardContent } from "@/features/dashboards/dashboard-widgets";
import { useDoctorDashboard } from "@/features/dashboards/dashboard.api";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
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
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="clinic-kicker">Doctor workspace</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Clinical priorities for today</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Waiting patients and active consultations stay in front. Analytics stay visible but secondary.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}><Stethoscope className="h-4 w-4" /> Open patients</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}><CalendarDays className="h-4 w-4" /> Review schedule</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "success", title: "Doctor dashboard ready", description: "Queue, analytics, and quick actions are loaded." })}
            >
              Check workspace
            </Button>
          </div>
        </div>
      </section>

      <DoctorDashboardContent summary={data} />
    </div>
  );
}
