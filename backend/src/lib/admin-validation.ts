import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

export const dateRangeQuerySchema = z.object({
  from: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  to: z.preprocess(emptyToUndefined, z.string().trim().optional())
});

export function optionalEnum<T extends [string, ...string[]]>(values: T) {
  return z.preprocess(emptyToUndefined, z.enum(values).optional());
}

export const idParamSchema = z.object({
  id: z.string().trim().min(1, "Id is required")
});

export const optionalTrimmedString = (max = 500) =>
  z.preprocess(emptyToUndefined, z.string().trim().min(1).max(max).optional());

export const requiredTrimmedString = (field: string, max = 255) =>
  z.string().trim().min(1, `${field} is required`).max(max);

export const queryBoolean = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (value === "true" || value === true) {
    return true;
  }

  if (value === "false" || value === false) {
    return false;
  }

  return value;
}, z.boolean().optional());

export const queryInteger = (defaultValue: number, max?: number) =>
  z.preprocess((value) => {
    if (value === undefined || value === null || value === "") {
      return defaultValue;
    }

    return Number(value);
  }, z.number().int().min(1).max(max ?? Number.MAX_SAFE_INTEGER));

export const paginationQuerySchema = z.object({
  page: queryInteger(1),
  pageSize: queryInteger(20, 100)
});

export const activeStatusQuerySchema = z.object({
  isActive: queryBoolean
});

export const activeStatusBodySchema = z.object({
  isActive: z.boolean()
});

export type IdParamInput = z.infer<typeof idParamSchema>;
export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>;
export type ActiveStatusBodyInput = z.infer<typeof activeStatusBodySchema>;
