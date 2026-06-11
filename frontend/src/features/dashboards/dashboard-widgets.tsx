import { ArrowRight, BarChart3, Users } from "lucide-react";
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
    <Card className={cn(item.priority === "urgent" && "border-amber-300 bg-amber-50/60")}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.subtitle}</CardDescription>
          </div>
          <StatusChip status={item.status} />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={item.priority === "urgent" ? "warning" : "outline"}>{item.priority}</Badge>
          <Badge variant="secondary">{item.type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
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
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summary.metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="pb-3">
            <CardDescription>{metric.label}</CardDescription>
            <CardTitle className="text-2xl">{metric.value}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Badge variant={metric.tone === "warning" ? "warning" : metric.tone === "success" ? "success" : metric.tone === "destructive" ? "destructive" : "secondary"}>
              {metric.trend ?? "Operational"}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export function DashboardGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {summary.items.map((item) => (
        <DashboardItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export function DoctorDashboardContent({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <WorkflowSection title="Priority queue" description="Waiting patients and active visits stay in the primary line of sight.">
          <DashboardGrid summary={summary} />
        </WorkflowSection>
        <WorkflowSection title="Analytics" description="Secondary indicators stay visible but never dominate the workflow.">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              Operational performance snapshot
            </div>
            <div className="space-y-3">
              {summary.metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </WorkflowSection>
      </section>

      <QuickActionBar title="Doctor quick actions" description="Keep the most common clinical commands one click away." actions={summary.quickActions} />
    </div>
  );
}

export function SecretaryDashboardContent({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(20rem,1fr)]">
        <WorkflowSection title="Reception work queue" description="Today's schedule, waiting patients, and new registrations stay visible first.">
          <DashboardGrid summary={summary} />
        </WorkflowSection>
        <WorkflowSection title="Reception metrics" description="Useful numbers for the front desk, not an analytics screen.">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Live operational volume
            </div>
            {summary.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border p-3">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-1 text-xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </WorkflowSection>
      </section>

      <QuickActionBar title="Secretary quick actions" description="Use these actions to register and book without extra navigation." actions={summary.quickActions} />
    </div>
  );
}
