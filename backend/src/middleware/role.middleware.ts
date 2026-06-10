import type { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/responses";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, "Forbidden"));
      return;
    }

    next();
  };
}
