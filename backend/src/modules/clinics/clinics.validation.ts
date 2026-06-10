import { z } from "zod";
import {
  activeStatusBodySchema,
  activeStatusQuerySchema,
  idParamSchema,
  optionalTrimmedString,
  paginationQuerySchema,
  requiredTrimmedString
} from "../../lib/admin-validation";

export const clinicListQuerySchema = paginationQuerySchema.merge(activeStatusQuerySchema);

export const clinicInputSchema = z.object({
  name: requiredTrimmedString("Name"),
  phone: optionalTrimmedString(50),
  address: optionalTrimmedString(500)
});

export const clinicParamsSchema = idParamSchema;
export const clinicStatusSchema = activeStatusBodySchema;

export type ClinicListQuery = z.infer<typeof clinicListQuerySchema>;
export type ClinicInput = z.infer<typeof clinicInputSchema>;
export type ClinicStatusInput = z.infer<typeof clinicStatusSchema>;
