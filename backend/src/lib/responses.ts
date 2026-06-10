import { Prisma } from "@prisma/client";
import type { Response } from "express";
import type { PaginationMeta } from "./pagination";

export type ErrorDetail = Record<string, unknown>;
export type DecimalString = string;

export type PaginatedData<T> = {
  items: T[];
  meta: PaginationMeta;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly errors: ErrorDetail[];

  constructor(statusCode: number, message: string, errors: ErrorDetail[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function sendSuccess<T>(res: Response, message: string, data: T) {
  return res.status(200).json({
    success: true,
    message,
    data
  });
}

export function sendCreated<T>(res: Response, message: string, data: T) {
  return res.status(201).json({
    success: true,
    message,
    data
  });
}

export function sendError(res: Response, statusCode: number, message: string, errors: ErrorDetail[] = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

export function toDecimalString(value: Prisma.Decimal | number | string): DecimalString {
  return new Prisma.Decimal(value).toFixed(2);
}
