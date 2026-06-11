import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/features/shared/workflow-api";
import type { WorkflowRole } from "@/types/workflow";

export const dashboardQueryKeys = {
  dashboard: (role: WorkflowRole) => ["workflow", "dashboard", role] as const
};

export function useWorkflowDashboard(role: WorkflowRole) {
  return useQuery({
    queryKey: dashboardQueryKeys.dashboard(role),
    queryFn: () => fetchDashboard(role)
  });
}

export function useDoctorDashboard() {
  return useWorkflowDashboard("DOCTOR");
}

export function useSecretaryDashboard() {
  return useWorkflowDashboard("SECRETARY");
}
