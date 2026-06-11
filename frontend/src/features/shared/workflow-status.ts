import type { BadgeProps } from "@/components/ui/badge";
import type { DashboardPriority, WorkflowStatus } from "@/types/workflow";

const priorityOrder: Record<DashboardPriority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3
};

const statusOrder: Record<WorkflowStatus, number> = {
  waiting: 0,
  scheduled: 1,
  open: 2,
  completed: 3,
  cancelled: 4,
  draft: 5,
  issued: 6,
  no_show: 7
};

const statusLabels: Record<WorkflowStatus, string> = {
  waiting: "Waiting",
  scheduled: "Scheduled",
  open: "Open",
  completed: "Completed",
  cancelled: "Cancelled",
  draft: "Draft",
  issued: "Issued",
  no_show: "No show"
};

const statusVariants: Record<WorkflowStatus, NonNullable<BadgeProps["variant"]>> = {
  waiting: "warning",
  scheduled: "secondary",
  open: "default",
  completed: "success",
  cancelled: "destructive",
  draft: "outline",
  issued: "success",
  no_show: "outline"
};

export function getPriorityRank(priority: DashboardPriority) {
  return priorityOrder[priority];
}

export function getStatusRank(status: WorkflowStatus) {
  return statusOrder[status];
}

export function getStatusLabel(status: WorkflowStatus) {
  return statusLabels[status];
}

export function getStatusVariant(status: WorkflowStatus): NonNullable<BadgeProps["variant"]> {
  return statusVariants[status];
}

export function sortAppointmentsByPriority<T extends { priority: DashboardPriority; scheduledAt: string; status: WorkflowStatus }>(items: T[]) {
  return [...items].sort((left, right) => {
    const priorityDiff = getPriorityRank(left.priority) - getPriorityRank(right.priority);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const statusDiff = getStatusRank(left.status) - getStatusRank(right.status);
    if (statusDiff !== 0) {
      return statusDiff;
    }

    return new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime();
  });
}
