import { CalendarPlus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { useSecretaryDashboard } from "@/features/dashboards/dashboard.api";
import { SecretaryDashboardContent } from "@/features/dashboards/secretary-dashboard-widgets";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";

export function SecretaryDashboardPage() {
  const { t } = useTranslation();
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = useSecretaryDashboard();

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data) {
    return <WorkflowErrorState title={t("dashboard.secretary.unavailable")} description={t("dashboard.secretary.unavailableDescription")} onRetry={() => void refetch()} />;
  }

  if (!data.items.length) {
    return (
      <WorkflowEmptyState
        title={t("dashboard.secretary.empty")}
        description={t("dashboard.secretary.emptyDescription")}
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
            <p className="clinic-kicker">{t("dashboard.secretary.kicker")}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("dashboard.secretary.title")}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("dashboard.secretary.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to={workflowRoutes.patients}><UserPlus className="h-4 w-4" /> {t("dashboard.actions.registerPatient")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={workflowRoutes.appointments}><CalendarPlus className="h-4 w-4" /> {t("dashboard.actions.bookAppointment")}</Link>
            </Button>
            <Button
              type="button"
              onClick={() => notify({ type: "info", title: t("dashboard.secretary.ready"), description: t("dashboard.secretary.readyDescription") })}
            >
              {t("dashboard.actions.checkReception")}
            </Button>
          </div>
        </div>
      </section>

      <SecretaryDashboardContent summary={data} />
    </div>
  );
}
