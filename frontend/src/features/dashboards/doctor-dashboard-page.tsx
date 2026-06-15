import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CalendarDays, Stethoscope } from "lucide-react";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { DoctorDashboardContent } from "@/features/dashboards/dashboard-widgets";
import { useDoctorDashboard } from "@/features/dashboards/dashboard.api";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";

export function DoctorDashboardPage() {
  const { t } = useTranslation();
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = useDoctorDashboard();

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data) {
    return <WorkflowErrorState title={t("dashboard.doctor.unavailable")} description={t("dashboard.doctor.unavailableDescription")} onRetry={() => void refetch()} />;
  }

  if (!data.items.length) {
    return (
      <WorkflowEmptyState
        title={t("dashboard.doctor.empty")}
        description={t("dashboard.doctor.emptyDescription")}
        actionLabel={t("dashboard.actions.refresh")}
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="clinic-kicker">{t("dashboard.doctor.kicker")}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("dashboard.doctor.title")}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("dashboard.doctor.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}><Stethoscope className="h-4 w-4" /> {t("dashboard.actions.openPatients")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}><CalendarDays className="h-4 w-4" /> {t("dashboard.actions.reviewSchedule")}</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "success", title: t("dashboard.doctor.ready"), description: t("dashboard.doctor.readyDescription") })}
            >
              {t("dashboard.actions.checkWorkspace")}
            </Button>
          </div>
        </div>
      </section>

      <DoctorDashboardContent summary={data} />
    </div>
  );
}
