import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { appointmentsService } from "./appointments.service";
import type { AppointmentInput, AppointmentListQuery, AppointmentStatusInput } from "./appointments.validation";

export async function listAppointments(req: Request, res: Response) {
  return sendSuccess(res, "Appointments retrieved", await appointmentsService.list(req.query as unknown as AppointmentListQuery));
}

export async function createAppointment(req: Request, res: Response) {
  return sendCreated(res, "Appointment created", await appointmentsService.create(req.body as AppointmentInput));
}

export async function getAppointment(req: Request, res: Response) {
  return sendSuccess(res, "Appointment retrieved", await appointmentsService.get(req.params.id));
}

export async function updateAppointment(req: Request, res: Response) {
  return sendSuccess(res, "Appointment updated", await appointmentsService.update(req.params.id, req.body as AppointmentInput));
}

export async function changeAppointmentStatus(req: Request, res: Response) {
  return sendSuccess(res, "Appointment status updated", await appointmentsService.changeStatus(req.params.id, req.body as AppointmentStatusInput));
}
