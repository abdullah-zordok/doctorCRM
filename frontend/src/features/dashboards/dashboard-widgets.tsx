import { Activity, ArrowRight, BarChart3, CalendarClock, Clock3, UserRoundCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActionBar } from "@/features/shared/quick-action-bar";
import { StatusChip } from "@/features/shared/status-chip";
import { WorkflowSection } from "@/features/shared/workflow-section";
import type { DashboardItem, DashboardSummary } from "@/types/workflow";
import { cn } from "@/lib/utils";

function DashboardItemCard({ item }: { item: DashboardItem }) {
  return (
    <Card className={cn("shadow-none transition hover:-translate-y-0.5 hover:shadow-soft", item.priority === "urgent" && "border-amber-300 bg-amber-50/65")}>
      <CardHeader className="space-y-3 p-4 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.subtitle}</CardDescription>
          </div>
          <StatusChip status={item.status} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.priority === "urgent" ? "warning" : "outline"}>{item.priority} priority</Badge>
          <Badge variant="secondary">{item.type.replace(/-/g, " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3 p-4 pt-0 sm:p-4 sm:pt-0">
        <span className="text-sm text-muted-foreground">{item.actionLabel}</span>
        <Link className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline" to={item.target.href}>
          {item.target.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function DashboardMetrics({ summary }: { summary: DashboardSummary }) {
  const icons = [Clock3, Activity, UserRoundCheck];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summary.metrics.map((metric, index) => {
        const Icon = icons[index] ?? Activity;
        return (
          <Card key={metric.label} className="overflow-hidden">
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
              <div>
                <CardDescription>{metric.label}</CardDescription>
                <CardTitle className="mt-2 text-3xl">{metric.value}</CardTitle>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant={metric.tone === "warning" ? "warning" : metric.tone === "success" ? "success" : metric.tone === "destructive" ? "destructive" : "secondary"}>
                {metric.trend ?? "Operational"}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

export function DashboardGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {summary.items.map((item) => (
        <DashboardItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function DoctorDashboardContent({ summary }: { summary: DashboardSummary }) {
  const urgentItems = summary.items.filter((item) => item.priority === "urgent" || item.status === "open" || item.status === "waiting");
  const followUpItems = summary.items.filter((item) => !urgentItems.includes(item));

  return (
    <div className="space-y-6">
      <DashboardMetrics summary={summary} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.85fr)]">
        <WorkflowSection title="Today's queue" description="Waiting patients and active consultations stay in the primary line of sight.">
          <div className="grid gap-3 md:grid-cols-2">
            {(urgentItems.length ? urgentItems : summary.items.slice(0, 4)).map((item) => <DashboardItemCard key={item.id} item={item} />)}
          </div>
        </WorkflowSection>
        <WorkflowSection title="Upcoming and recent" description="Secondary context for the rest of the clinic day.">
          <div className="space-y-3">
            {followUpItems.slice(0, 4).map((item) => (
              <Link key={item.id} to={item.target.href} className="clinic-focus flex items-center gap-3 rounded-2xl border p-3 transition hover:bg-muted/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <CalendarClock className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{item.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                </span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-2xl bg-muted/50 p-3 text-xs text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Analytics remain secondary to today's clinical work.
            </div>
          </div>
        </WorkflowSection>
      </section>

      <QuickActionBar title="Doctor quick actions" description="Keep the most common clinical commands one click away." actions={summary.quickActions} />
    </div>
  );
}
