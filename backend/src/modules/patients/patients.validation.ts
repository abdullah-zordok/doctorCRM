import { z } from "zod";
import {
  activeStatusBodySchema,
  activeStatusQuerySchema,
  idParamSchema,
  optionalTrimmedString,
  paginationQuerySchema,
  requiredTrimmedString
} from "../../lib/admin-validation";

export const patientListQuerySchema = paginationQuerySchema.merge(activeStatusQuerySchema).extend({
  search: optionalTrimmedString(255),
  clinicId: optionalTrimmedString(255)
});

export const patientInputSchema = z.object({
  name: requiredTrimmedString("Name"),
  phone: requiredTrimmedString("Phone", 50),
  clinicId: requiredTrimmedString("Clinic", 255),
  notes: optionalTrimmedString(1000)
});

export const patientParamsSchema = idParamSchema;
export const patientStatusSchema = activeStatusBodySchema;

export type PatientListQuery = z.infer<typeof patientListQuerySchema>;
export type PatientInput = z.infer<typeof patientInputSchema>;
export type PatientStatusInput = z.infer<typeof patientStatusSchema>;
