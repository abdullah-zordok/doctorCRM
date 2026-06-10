import type { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { ZodError } from "zod";
import { AppError, sendError } from "../lib/responses";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  void _next;

  if (error instanceof ZodError) {
    return sendError(
      res,
      400,
      "Validation error",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    );
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    return sendError(res, 401, "Unauthorized", []);
  }

  if (error instanceof AppError) {
    return sendError(res, error.statusCode, error.message, error.errors);
  }

  console.error(error);
  return sendError(res, 500, "Internal server error", []);
}
