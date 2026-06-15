import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { fetchDashboard } from "@/features/shared/workflow-api";
import type { WorkflowRole } from "@/types/workflow";

export const dashboardQueryKeys = {
  dashboard: (role: WorkflowRole, language: string) => ["workflow", "dashboard", role, language] as const
};

export function useWorkflowDashboard(role: WorkflowRole) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  return useQuery({
    queryKey: dashboardQueryKeys.dashboard(role, language),
    queryFn: () => fetchDashboard(role, language),
    staleTime: 30_000
  });
}

export function useDoctorDashboard() {
  return useWorkflowDashboard("DOCTOR");
}

export function useSecretaryDashboard() {
  return useWorkflowDashboard("SECRETARY");
}
