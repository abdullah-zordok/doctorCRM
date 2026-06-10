import assert from "node:assert/strict";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../src/lib/responses";
import { requireRole } from "../../src/middleware/role.middleware";

function runMiddleware(req: Partial<Request>) {
  const calls: unknown[] = [];
  const next = ((error?: unknown) => {
    calls.push(error);
  }) as NextFunction;
  requireRole("DOCTOR")(req as Request, {} as Response, next);
  return calls;
}

export async function run() {
  const doctorCalls = runMiddleware({
    user: {
      id: "user_1",
      email: "doctor@example.com",
      name: "Clinic Doctor",
      role: "DOCTOR",
      isActive: true
    }
  });
  assert.equal(doctorCalls.length, 1);
  assert.equal(doctorCalls[0], undefined);

  const secretaryCalls = runMiddleware({
    user: {
      id: "user_2",
      email: "secretary@example.com",
      name: "Secretary",
      role: "SECRETARY",
      isActive: true
    }
  });
  assert.ok(secretaryCalls[0] instanceof AppError);
  assert.equal((secretaryCalls[0] as AppError).statusCode, 403);

  const missingUserCalls = runMiddleware({});
  assert.ok(missingUserCalls[0] instanceof AppError);
  assert.equal((missingUserCalls[0] as AppError).statusCode, 403);
}
