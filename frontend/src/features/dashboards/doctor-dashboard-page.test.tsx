import { fetchDashboard } from "@/features/shared/workflow-api";

export async function verifyDoctorDashboardPriorityScenario() {
  const dashboard = await fetchDashboard("DOCTOR");
  const firstItem = dashboard.items[0];

  return {
    hasQueueFirst: firstItem?.type === "waiting-patient",
    hasUrgentPriority: firstItem?.priority === "urgent",
    hasClinicalActions: dashboard.quickActions.some((action) => action.label === "Start visit"),
    analyticsRemainSecondary: dashboard.metrics.length > 0 && dashboard.items.length > dashboard.metrics.length
  };
}
