import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import {
  getDoctorRevenue,
  getDoctorSummary,
  getDoctorTodayAppointments,
  getSecretarySummary,
  getSecretaryTodayAppointments
} from "./dashboards.controller";
import { dashboardQuerySchema } from "./dashboards.validation";

export const dashboardRouter = Router();

dashboardRouter.get(
  "/doctor/summary",
  authenticate,
  requireRole(Role.DOCTOR),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getDoctorSummary)
);

dashboardRouter.get(
  "/doctor/revenue",
  authenticate,
  requireRole(Role.DOCTOR),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getDoctorRevenue)
);

dashboardRouter.get(
  "/doctor/today-appointments",
  authenticate,
  requireRole(Role.DOCTOR),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getDoctorTodayAppointments)
);

dashboardRouter.get(
  "/secretary/summary",
  authenticate,
  requireRole(Role.SECRETARY),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getSecretarySummary)
);

dashboardRouter.get(
  "/secretary/today-appointments",
  authenticate,
  requireRole(Role.SECRETARY),
  validateRequest({ query: dashboardQuerySchema }),
  asyncHandler(getSecretaryTodayAppointments)
);
