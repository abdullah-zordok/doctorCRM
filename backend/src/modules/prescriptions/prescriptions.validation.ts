import { PrescriptionStatus } from "@prisma/client";
import { z } from "zod";
import {
  idParamSchema,
  optionalTrimmedString,
  requiredTrimmedString,
  dateRangeQuerySchema,
  paginationQuerySchema
} from "../../lib/admin-validation";

export const medicationSchema = z.object({
  name: requiredTrimmedString("Medication name", 255),
  dosage: requiredTrimmedString("Dosage", 255),
  frequency: requiredTrimmedString("Frequency", 255),
  duration: requiredTrimmedString("Duration", 255)
});

export const prescriptionListQuerySchema = paginationQuerySchema.merge(dateRangeQuerySchema).extend({
  visitId: optionalTrimmedString(255),
  doctorId: optionalTrimmedString(255),
  status: z.nativeEnum(PrescriptionStatus).optional()
});

export const prescriptionCollectionParamsSchema = z.object({
  visitId: optionalTrimmedString(255)
});

export const prescriptionInputSchema = z.object({
  visitId: optionalTrimmedString(255),
  medications: z.array(medicationSchema).min(1, "At least one medication is required"),
  instructions: requiredTrimmedString("Instructions", 4000),
  status: z.nativeEnum(PrescriptionStatus).optional()
});

export const prescriptionUpdateSchema = z.object({
  medications: z.array(medicationSchema).min(1).optional(),
  instructions: optionalTrimmedString(4000),
  reason: requiredTrimmedString("Reason", 500)
});

export const prescriptionParamsSchema = idParamSchema.extend({
  visitId: optionalTrimmedString(255)
});

export type PrescriptionListQuery = z.infer<typeof prescriptionListQuerySchema>;
export type PrescriptionInput = z.infer<typeof prescriptionInputSchema>;
export type PrescriptionUpdateInput = z.infer<typeof prescriptionUpdateSchema>;
export type MedicationInput = z.infer<typeof medicationSchema>;
