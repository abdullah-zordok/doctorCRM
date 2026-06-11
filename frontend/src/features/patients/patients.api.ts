import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, createPatient, fetchPatient, fetchPatients, searchWorkflow, updatePatient } from "@/features/shared/workflow-api";
import { workflowRoutes } from "@/routes/workflow-routes";
import type { PatientRecord } from "@/types/workflow";

export const patientQueryKeys = {
  list: (search: string, page: number, pageSize: number, sortBy: string) => ["workflow", "patients", "list", search, page, pageSize, sortBy] as const,
  detail: (patientId: string) => ["workflow", "patients", patientId] as const,
  search: (query: string) => ["workflow", "global-search", query] as const
};

export function usePatients(search: string, page: number, pageSize: number, sortBy: "name" | "recent" | "code") {
  return useQuery({
    queryKey: patientQueryKeys.list(search, page, pageSize, sortBy),
    queryFn: () => fetchPatients({ search, page, pageSize, sortBy })
  });
}

export function usePatientProfile(patientId: string) {
  return useQuery({
    queryKey: patientQueryKeys.detail(patientId),
    queryFn: () => fetchPatient(patientId),
    enabled: Boolean(patientId)
  });
}

export function usePatientLookup(query: string) {
  return useQuery({
    queryKey: patientQueryKeys.search(query),
    queryFn: () => searchWorkflow(query),
    enabled: query.trim().length >= 2
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patientId, data }: { patientId: string; data: Partial<PatientRecord> }) => updatePatient(patientId, data),
    onSuccess: async (patient) => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
      queryClient.setQueryData(patientQueryKeys.detail(patient.id), patient);
    }
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}

export function patientProfileTarget(patientId: string) {
  return workflowRoutes.patientProfile(patientId);
}
