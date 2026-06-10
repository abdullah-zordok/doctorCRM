import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { sendPdfResponse } from "../../lib/pdf";
import { prescriptionsService } from "./prescriptions.service";
import type { PrescriptionInput, PrescriptionUpdateInput } from "./prescriptions.validation";

export async function createPrescription(req: Request, res: Response) {
  const visitId = String(req.params.visitId || req.body.visitId || "");
  const result = await prescriptionsService.create(visitId, req.body as PrescriptionInput, req.user!.id);
  return sendCreated(res, "Prescription created", result);
}

export async function getPrescription(req: Request, res: Response) {
  const result = await prescriptionsService.get(req.params.id);
  return sendSuccess(res, "Prescription retrieved", result);
}

export async function updatePrescription(req: Request, res: Response) {
  const result = await prescriptionsService.update(req.params.id, req.body as PrescriptionUpdateInput, req.user!.id);
  return sendSuccess(res, "Prescription updated", result);
}

export async function getPrescriptionPdf(req: Request, res: Response) {
  const buffer = await prescriptionsService.createPdf(req.params.id);
  return sendPdfResponse(res, `prescription-${req.params.id}.pdf`, buffer);
}
