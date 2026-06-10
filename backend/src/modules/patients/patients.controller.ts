import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { patientsService } from "./patients.service";
import type { PatientInput, PatientListQuery, PatientStatusInput } from "./patients.validation";

export async function listPatients(req: Request, res: Response) {
  return sendSuccess(res, "Patients retrieved", await patientsService.list(req.query as unknown as PatientListQuery));
}

export async function createPatient(req: Request, res: Response) {
  return sendCreated(res, "Patient created", await patientsService.create(req.body as PatientInput));
}

export async function getPatient(req: Request, res: Response) {
  return sendSuccess(res, "Patient retrieved", await patientsService.get(req.params.id));
}

export async function updatePatient(req: Request, res: Response) {
  return sendSuccess(res, "Patient updated", await patientsService.update(req.params.id, req.body as PatientInput));
}

export async function changePatientStatus(req: Request, res: Response) {
  return sendSuccess(res, "Patient status updated", await patientsService.changeStatus(req.params.id, req.body as PatientStatusInput));
}
