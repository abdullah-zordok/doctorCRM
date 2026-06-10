import { Prisma } from "@prisma/client";

export type DecimalInput = Prisma.Decimal | number | string;

export function toDecimal(value: DecimalInput) {
  return value instanceof Prisma.Decimal ? value : new Prisma.Decimal(value);
}

export function decimalToString(value: DecimalInput) {
  return toDecimal(value).toFixed(2);
}

export function isMoneyString(value: unknown) {
  return typeof value === "string" && /^\d+(?:\.\d{1,2})?$/.test(value.trim());
}

export function compareDecimals(left: DecimalInput, right: DecimalInput) {
  return toDecimal(left).cmp(toDecimal(right));
}
