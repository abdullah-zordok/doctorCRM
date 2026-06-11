import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchVisit, finishVisit, updateVisit } from "@/features/shared/workflow-api";

export const visitQueryKeys = {
  detail: (visitId: string) => ["workflow", "visits", visitId] as const
};

export function useVisit(visitId: string) {
  return useQuery({
    queryKey: visitQueryKeys.detail(visitId),
    queryFn: () => fetchVisit(visitId),
    enabled: Boolean(visitId)
  });
}

export function useUpdateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, data }: { visitId: string; data: { chiefComplaint: string; diagnosis: string; clinicalNotes: string; followUpNotes: string } }) =>
      updateVisit(visitId, data),
    onSuccess: async (visit, variables) => {
      queryClient.setQueryData(visitQueryKeys.detail(variables.visitId), (current: unknown) => {
        if (!current || typeof current !== "object") {
          return current;
        }
        return { ...(current as Record<string, unknown>), visit };
      });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}

export function useFinishVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, data }: { visitId: string; data: { chiefComplaint: string; diagnosis: string; clinicalNotes: string; followUpNotes: string } }) =>
      finishVisit(visitId, data),
    onSuccess: async (visit, variables) => {
      queryClient.setQueryData(visitQueryKeys.detail(variables.visitId), (current: unknown) => {
        if (!current || typeof current !== "object") {
          return current;
        }
        return { ...(current as Record<string, unknown>), visit };
      });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}
