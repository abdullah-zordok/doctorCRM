import { getNavigationForRole, getNavigationItem } from "@/layout/navigation";
import { workflowRoutes } from "@/routes/workflow-routes";

export const workflowRouteSmokeExpectations = [
  workflowRoutes.doctorDashboard,
  workflowRoutes.secretaryDashboard,
  workflowRoutes.patients,
  workflowRoutes.patientProfile("pat-001"),
  workflowRoutes.visitWorkspace("vis-001"),
  workflowRoutes.prescriptionBuilder("vis-001"),
  workflowRoutes.appointments
];

export function verifyWorkflowRouteSmokeExpectations() {
  const doctorNav = getNavigationForRole("DOCTOR").map((item) => item.path);
  const secretaryNav = getNavigationForRole("SECRETARY").map((item) => item.path);

  return {
    doctorHasClinicalRoutes: doctorNav.includes(workflowRoutes.doctorDashboard) && doctorNav.includes("/visits") && doctorNav.includes("/prescriptions"),
    secretaryHasReceptionRoutes: secretaryNav.includes(workflowRoutes.secretaryDashboard) && secretaryNav.includes(workflowRoutes.patients),
    nestedPatientRouteMatches: getNavigationItem(workflowRoutes.patientProfile("pat-001"))?.labelKey === "navigation.patients",
    prescriptionRouteMatches: getNavigationItem(workflowRoutes.prescriptionBuilder("vis-001"))?.labelKey === "navigation.prescriptions"
  };
}
