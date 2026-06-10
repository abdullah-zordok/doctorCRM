import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

type RequestSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

function trimStrings(value: unknown): unknown {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value.map(trimStrings);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, nestedValue]) => [key, trimStrings(nestedValue)])
    );
  }

  return value;
}

function parseWithSchema(schema: ZodTypeAny, value: unknown) {
  return schema.parse(trimStrings(value));
}

export function validateRequest(schemas: RequestSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      req.body = parseWithSchema(schemas.body, req.body);
    }

    if (schemas.query) {
      req.query = parseWithSchema(schemas.query, req.query) as Request["query"];
    }

    if (schemas.params) {
      req.params = parseWithSchema(schemas.params, req.params) as Request["params"];
    }

    next();
  };
}
