import { VisitStatus } from "@prisma/client";
import { z } from "zod";
import {
  dateRangeQuerySchema,
  idParamSchema,
  optionalTrimmedString,
  paginationQuerySchema,
  requiredTrimmedString
} from "../../lib/admin-validation";

export const visitListQuerySchema = paginationQuerySchema.merge(dateRangeQuerySchema).extend({
  patientId: optionalTrimmedString(255),
  clinicId: optionalTrimmedString(255),
  doctorId: optionalTrimmedString(255),
  status: z.nativeEnum(VisitStatus).optional()
});

export const visitCollectionParamsSchema = z.object({
  patientId: optionalTrimmedString(255)
});

export const visitInputSchema = z.object({
  patientId: optionalTrimmedString(255),
  clinicId: requiredTrimmedString("Clinic", 255),
  visitDate: z.string().trim().datetime().transform((value) => new Date(value)),
  diagnosis: requiredTrimmedString("Diagnosis", 2000),
  treatment: requiredTrimmedString("Treatment", 2000),
  notes: optionalTrimmedString(2000),
  status: z.nativeEnum(VisitStatus).optional()
});

export const visitUpdateSchema = z.object({
  diagnosis: optionalTrimmedString(2000),
  treatment: optionalTrimmedString(2000),
  notes: optionalTrimmedString(2000),
  reason: requiredTrimmedString("Reason", 500)
});

export const visitParamsSchema = idParamSchema.extend({
  patientId: optionalTrimmedString(255)
});

export type VisitListQuery = z.infer<typeof visitListQuerySchema>;
export type VisitInput = z.infer<typeof visitInputSchema>;
export type VisitUpdateInput = z.infer<typeof visitUpdateSchema>;
