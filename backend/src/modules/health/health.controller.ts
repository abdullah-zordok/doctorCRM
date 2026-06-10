import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/responses";
import { getReadiness } from "./health.service";

export async function health(_req: Request, res: Response) {
  const readiness = await getReadiness();
  return sendSuccess(res, "Service is ready", readiness);
}
