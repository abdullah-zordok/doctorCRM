import type { Response } from "express";

export type ErrorDetail = Record<string, unknown>;

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

export function sendError(res: Response, statusCode: number, message: string, errors: ErrorDetail[] = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}
