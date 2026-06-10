import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { visitsService } from "./visits.service";
import type { VisitInput, VisitListQuery, VisitUpdateInput } from "./visits.validation";

export async function listVisits(req: Request, res: Response) {
  const query = req.query as unknown as VisitListQuery;
  const patientId = req.params.patientId ? String(req.params.patientId) : undefined;
  const result = await visitsService.list({
    ...query,
    ...(patientId ? { patientId } : {})
  });

  return sendSuccess(res, "Visits retrieved", result);
}

export async function createVisit(req: Request, res: Response) {
  const patientId = String(req.params.patientId || req.body.patientId || "");
  const input = req.body as VisitInput;
  const result = await visitsService.create(patientId, input, req.user!.id);
  return sendCreated(res, "Visit created", result);
}

export async function getVisit(req: Request, res: Response) {
  const result = await visitsService.get(req.params.id);
  return sendSuccess(res, "Visit retrieved", result);
}

export async function updateVisit(req: Request, res: Response) {
  const result = await visitsService.update(req.params.id, req.body as VisitUpdateInput, req.user!.id);
  return sendSuccess(res, "Visit updated", result);
}
