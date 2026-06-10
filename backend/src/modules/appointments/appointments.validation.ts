import { AppointmentStatus } from "@prisma/client";
import { z } from "zod";
import { idParamSchema, optionalTrimmedString, paginationQuerySchema, requiredTrimmedString } from "../../lib/admin-validation";

export const appointmentListQuerySchema = paginationQuerySchema.extend({
  date: z.string().trim().date().optional(),
  clinicId: optionalTrimmedString(255),
  patientId: optionalTrimmedString(255),
  status: z.nativeEnum(AppointmentStatus).optional()
});

export const appointmentInputSchema = z.object({
  patientId: requiredTrimmedString("Patient", 255),
  clinicId: requiredTrimmedString("Clinic", 255),
  scheduledAt: z.string().trim().datetime().transform((value) => new Date(value)),
  status: z.nativeEnum(AppointmentStatus).optional(),
  notes: optionalTrimmedString(1000)
});

export const appointmentParamsSchema = idParamSchema;

export const appointmentStatusSchema = z.object({
  status: z.nativeEnum(AppointmentStatus)
});

export type AppointmentListQuery = z.infer<typeof appointmentListQuerySchema>;
export type AppointmentInput = z.infer<typeof appointmentInputSchema>;
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
