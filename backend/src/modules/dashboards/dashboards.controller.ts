import type { Request, Response } from "express";
import { sendSuccess } from "../../lib/responses";
import { dashboardsService } from "./dashboards.service";
import type { DashboardQuery } from "./dashboards.validation";

export async function getDoctorSummary(req: Request, res: Response) {
  const result = await dashboardsService.doctorSummary(req.query as unknown as DashboardQuery);
  return sendSuccess(res, "Doctor summary retrieved", result);
}

export async function getDoctorRevenue(req: Request, res: Response) {
  const result = await dashboardsService.doctorRevenue(req.query as unknown as DashboardQuery);
  return sendSuccess(res, "Doctor revenue retrieved", result);
}

export async function getDoctorTodayAppointments(req: Request, res: Response) {
  const result = await dashboardsService.doctorTodayAppointments(req.query as unknown as DashboardQuery);
  return sendSuccess(res, "Doctor appointments retrieved", result);
}

export async function getSecretarySummary(req: Request, res: Response) {
  const result = await dashboardsService.secretarySummary(req.query as unknown as DashboardQuery);
  return sendSuccess(res, "Secretary summary retrieved", result);
}

export async function getSecretaryTodayAppointments(req: Request, res: Response) {
  const result = await dashboardsService.secretaryTodayAppointments(req.query as unknown as DashboardQuery);
  return sendSuccess(res, "Secretary appointments retrieved", result);
}
