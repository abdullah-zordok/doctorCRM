import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { secretariesService } from "./secretaries.service";
import type { CreateSecretaryInput, SecretaryListQuery, SecretaryStatusInput, UpdateSecretaryInput } from "./secretaries.validation";

export async function listSecretaries(req: Request, res: Response) {
  return sendSuccess(res, "Secretaries retrieved", await secretariesService.list(req.query as unknown as SecretaryListQuery));
}

export async function createSecretary(req: Request, res: Response) {
  return sendCreated(res, "Secretary created", await secretariesService.create(req.body as CreateSecretaryInput));
}

export async function getSecretary(req: Request, res: Response) {
  return sendSuccess(res, "Secretary retrieved", await secretariesService.get(req.params.id));
}

export async function updateSecretary(req: Request, res: Response) {
  return sendSuccess(res, "Secretary updated", await secretariesService.update(req.params.id, req.body as UpdateSecretaryInput));
}

export async function changeSecretaryStatus(req: Request, res: Response) {
  return sendSuccess(res, "Secretary status updated", await secretariesService.changeStatus(req.params.id, req.body as SecretaryStatusInput));
}
