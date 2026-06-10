import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/responses";
import { authService } from "../modules/auth/auth.service";
import { findActiveUserById, toSafeUser } from "../modules/users/user.service";

function extractBearerToken(header?: string) {
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req.header("authorization"));
    if (!token) {
      throw new AppError(401, "Unauthorized");
    }

    const payload = authService.verifyToken(token);
    const user = await findActiveUserById(payload.sub);
    if (!user) {
      throw new AppError(401, "Unauthorized");
    }

    req.user = toSafeUser(user);
    next();
  } catch (error) {
    next(error);
  }
}
