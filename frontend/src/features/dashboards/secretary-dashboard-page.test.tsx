import { fetchDashboard } from "@/features/shared/workflow-api";

export async function verifySecretaryDashboardScenario() {
  const dashboard = await fetchDashboard("SECRETARY");

  return {
    hasReceptionItems: dashboard.items.some((item) => item.type === "upcoming-appointment" || item.type === "waiting-patient"),
    hasRegistrationAction: dashboard.quickActions.some((action) => action.label === "Add patient"),
    hidesDoctorOnlyPrescriptionAction: dashboard.quickActions.every((action) => action.label !== "Generate prescription")
  };
}
