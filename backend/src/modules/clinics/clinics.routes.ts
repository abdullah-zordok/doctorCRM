import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { changeClinicStatus, createClinic, getClinic, listClinics, updateClinic } from "./clinics.controller";
import { clinicInputSchema, clinicListQuerySchema, clinicParamsSchema, clinicStatusSchema } from "./clinics.validation";

export const clinicsRouter = Router();

clinicsRouter.use(authenticate);

clinicsRouter.get("/", requireRole(Role.DOCTOR, Role.SECRETARY), validateRequest({ query: clinicListQuerySchema }), asyncHandler(listClinics));
clinicsRouter.post("/", requireRole(Role.DOCTOR), validateRequest({ body: clinicInputSchema }), asyncHandler(createClinic));
clinicsRouter.get("/:id", requireRole(Role.DOCTOR, Role.SECRETARY), validateRequest({ params: clinicParamsSchema }), asyncHandler(getClinic));
clinicsRouter.patch(
  "/:id",
  requireRole(Role.DOCTOR),
  validateRequest({ params: clinicParamsSchema, body: clinicInputSchema }),
  asyncHandler(updateClinic)
);
clinicsRouter.patch(
  "/:id/status",
  requireRole(Role.DOCTOR),
  validateRequest({ params: clinicParamsSchema, body: clinicStatusSchema }),
  asyncHandler(changeClinicStatus)
);
