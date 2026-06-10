import { z } from "zod";
import {
  activeStatusBodySchema,
  activeStatusQuerySchema,
  idParamSchema,
  paginationQuerySchema,
  requiredTrimmedString
} from "../../lib/admin-validation";

export const secretaryListQuerySchema = paginationQuerySchema.merge(activeStatusQuerySchema);

export const createSecretarySchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  name: requiredTrimmedString("Name"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export const updateSecretarySchema = z
  .object({
    email: z.string().trim().email().toLowerCase().optional(),
    name: requiredTrimmedString("Name").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional()
  })
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");

export const secretaryParamsSchema = idParamSchema;
export const secretaryStatusSchema = activeStatusBodySchema;

export type SecretaryListQuery = z.infer<typeof secretaryListQuerySchema>;
export type CreateSecretaryInput = z.infer<typeof createSecretarySchema>;
export type UpdateSecretaryInput = z.infer<typeof updateSecretarySchema>;
export type SecretaryStatusInput = z.infer<typeof secretaryStatusSchema>;
