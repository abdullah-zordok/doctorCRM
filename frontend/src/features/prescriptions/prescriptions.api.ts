import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPrescription, fetchPrescriptionBuilderContext } from "@/features/shared/workflow-api";

export const prescriptionQueryKeys = {
  builder: (visitId: string) => ["workflow", "prescriptions", "builder", visitId] as const
};

export function usePrescriptionBuilder(visitId: string) {
  return useQuery({
    queryKey: prescriptionQueryKeys.builder(visitId),
    queryFn: () => fetchPrescriptionBuilderContext(visitId),
    enabled: Boolean(visitId)
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ visitId, data }: { visitId: string; data: Parameters<typeof createPrescription>[1] }) => createPrescription(visitId, data),
    onSuccess: async (_prescription, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "visits", variables.visitId] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}
