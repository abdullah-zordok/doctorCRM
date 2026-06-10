import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import {
  changeAppointmentStatus,
  createAppointment,
  getAppointment,
  listAppointments,
  updateAppointment
} from "./appointments.controller";
import {
  appointmentInputSchema,
  appointmentListQuerySchema,
  appointmentParamsSchema,
  appointmentStatusSchema
} from "./appointments.validation";

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticate, requireRole(Role.DOCTOR, Role.SECRETARY));

appointmentsRouter.get("/", validateRequest({ query: appointmentListQuerySchema }), asyncHandler(listAppointments));
appointmentsRouter.post("/", validateRequest({ body: appointmentInputSchema }), asyncHandler(createAppointment));
appointmentsRouter.get("/:id", validateRequest({ params: appointmentParamsSchema }), asyncHandler(getAppointment));
appointmentsRouter.patch(
  "/:id",
  validateRequest({ params: appointmentParamsSchema, body: appointmentInputSchema }),
  asyncHandler(updateAppointment)
);
appointmentsRouter.patch(
  "/:id/status",
  validateRequest({ params: appointmentParamsSchema, body: appointmentStatusSchema }),
  asyncHandler(changeAppointmentStatus)
);
