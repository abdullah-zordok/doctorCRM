import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { clinicsService } from "./clinics.service";
import type { ClinicInput, ClinicListQuery, ClinicStatusInput } from "./clinics.validation";

export async function listClinics(req: Request, res: Response) {
  return sendSuccess(res, "Clinics retrieved", await clinicsService.list(req.query as unknown as ClinicListQuery, req.user?.role));
}

export async function createClinic(req: Request, res: Response) {
  return sendCreated(res, "Clinic created", await clinicsService.create(req.body as ClinicInput));
}

export async function getClinic(req: Request, res: Response) {
  return sendSuccess(res, "Clinic retrieved", await clinicsService.get(req.params.id, req.user?.role));
}

export async function updateClinic(req: Request, res: Response) {
  return sendSuccess(res, "Clinic updated", await clinicsService.update(req.params.id, req.body as ClinicInput));
}

export async function changeClinicStatus(req: Request, res: Response) {
  return sendSuccess(res, "Clinic status updated", await clinicsService.changeStatus(req.params.id, req.body as ClinicStatusInput));
}
