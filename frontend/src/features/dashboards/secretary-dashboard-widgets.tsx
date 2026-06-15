import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardGrid, DashboardMetrics } from "@/features/dashboards/dashboard-widgets";
import { QuickActionBar } from "@/features/shared/quick-action-bar";
import { WorkflowSection } from "@/features/shared/workflow-section";
import type { DashboardSummary } from "@/types/workflow";

export function SecretaryDashboardContent({ summary }: { summary: DashboardSummary }) {
  const { t } = useTranslation();
  const scheduled = summary.items.filter((item) => item.type === "upcoming-appointment" || item.type === "waiting-patient");
  const recent = summary.items.filter((item) => !scheduled.includes(item));

  return (
    <div className="space-y-6">
      <DashboardMetrics summary={summary} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.85fr)]">
        <WorkflowSection title={t("dashboard.todaySchedule")} description={t("dashboard.todayScheduleDescription")}>
          {scheduled.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              <DashboardGrid summary={{ ...summary, items: scheduled }} />
            </div>
          ) : (
            <DashboardGrid summary={summary} />
          )}
        </WorkflowSection>

        <WorkflowSection title={t("dashboard.receptionOverview")} description={t("dashboard.receptionOverviewDescription")}>
          <div className="space-y-3">
            {recent.slice(0, 4).map((item) => (
              <Link key={item.id} to={item.target.href} className="clinic-focus flex items-center gap-3 rounded-2xl border p-3 transition hover:bg-muted/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  {item.type === "new-patient" ? <Users className="h-4 w-4" /> : <CalendarDays className="h-4 w-4" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                </span>
                <ArrowRight className="icon-directional h-4 w-4 text-primary" />
              </Link>
            ))}
          </div>
        </WorkflowSection>
      </section>

      <QuickActionBar title={t("dashboard.secretaryActions")} description={t("dashboard.secretaryActionsDescription")} actions={summary.quickActions} />
    </div>
  );
}
