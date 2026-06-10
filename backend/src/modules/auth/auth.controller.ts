import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/responses";
import { authService } from "./auth.service";
import type { LoginInput } from "./auth.validation";

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body as LoginInput);
  return sendSuccess(res, "Login successful", result);
}

export async function me(req: Request, res: Response) {
  return sendSuccess(res, "Current user retrieved", authService.currentUser(req.user!));
}

export async function logout(_req: Request, res: Response) {
  return sendSuccess(res, "Logout successful", authService.logout());
}
