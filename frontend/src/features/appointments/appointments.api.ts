import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAppointment, fetchAppointments, updateAppointment, updateAppointmentStatus } from "@/features/shared/workflow-api";
import type { AppointmentRecord } from "@/types/workflow";

export const appointmentQueryKeys = {
  list: (search: string, page: number, pageSize: number, status: string) => ["workflow", "appointments", listSignature(search, page, pageSize, status)] as const
};

function listSignature(search: string, page: number, pageSize: number, status: string) {
  return { search, page, pageSize, status };
}

export function useAppointments(search: string, page: number, pageSize: number, status: "all" | AppointmentRecord["status"]) {
  return useQuery({
    queryKey: appointmentQueryKeys.list(search, page, pageSize, status),
    queryFn: () => fetchAppointments({ search, page, pageSize, status })
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, data }: { appointmentId: string; data: Parameters<typeof updateAppointment>[1] }) => updateAppointment(appointmentId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "patients"] });
    }
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: AppointmentRecord["status"] }) => updateAppointmentStatus(appointmentId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["workflow", "appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["workflow", "dashboard"] });
    }
  });
}
