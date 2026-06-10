import { PaymentMethod } from "@prisma/client";
import { z } from "zod";
import {
  dateRangeQuerySchema,
  idParamSchema,
  optionalTrimmedString,
  paginationQuerySchema,
  requiredTrimmedString
} from "../../lib/admin-validation";
import { isMoneyString } from "../../lib/decimal";

const moneySchema = z.string().trim().refine(isMoneyString, "Amount must be zero or greater with up to 2 decimals");

export const paymentListQuerySchema = paginationQuerySchema.merge(dateRangeQuerySchema).extend({
  patientId: optionalTrimmedString(255),
  clinicId: optionalTrimmedString(255),
  visitId: optionalTrimmedString(255),
  receivedByUserId: optionalTrimmedString(255),
  method: z.nativeEnum(PaymentMethod).optional()
});

export const paymentInputSchema = z.object({
  patientId: requiredTrimmedString("Patient", 255),
  clinicId: requiredTrimmedString("Clinic", 255),
  visitId: optionalTrimmedString(255),
  totalAmount: moneySchema,
  paidAmount: moneySchema,
  method: z.nativeEnum(PaymentMethod),
  paidAt: z.string().trim().datetime().transform((value) => new Date(value)).optional(),
  notes: optionalTrimmedString(2000)
});

export const paymentUpdateSchema = z.object({
  totalAmount: moneySchema.optional(),
  paidAmount: moneySchema.optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  notes: optionalTrimmedString(2000),
  reason: requiredTrimmedString("Reason", 500)
});

export const paymentParamsSchema = idParamSchema;

export const paymentSummaryQuerySchema = dateRangeQuerySchema.extend({
  clinicId: optionalTrimmedString(255)
});

export type PaymentListQuery = z.infer<typeof paymentListQuerySchema>;
export type PaymentInput = z.infer<typeof paymentInputSchema>;
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
export type PaymentSummaryQuery = z.infer<typeof paymentSummaryQuerySchema>;
