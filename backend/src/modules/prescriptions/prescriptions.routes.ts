import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import {
  createPrescription,
  getPrescription,
  getPrescriptionPdf,
  updatePrescription
} from "./prescriptions.controller";
import {
  prescriptionCollectionParamsSchema,
  prescriptionInputSchema,
  prescriptionParamsSchema,
  prescriptionUpdateSchema
} from "./prescriptions.validation";

export const prescriptionsRouter = Router({ mergeParams: true });

prescriptionsRouter.use(authenticate, requireRole(Role.DOCTOR, Role.SECRETARY));

prescriptionsRouter.post(
  "/",
  validateRequest({ params: prescriptionCollectionParamsSchema, body: prescriptionInputSchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(createPrescription)
);

prescriptionsRouter.get("/:id", validateRequest({ params: prescriptionParamsSchema }), asyncHandler(getPrescription));
prescriptionsRouter.patch(
  "/:id",
  validateRequest({ params: prescriptionParamsSchema, body: prescriptionUpdateSchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(updatePrescription)
);
prescriptionsRouter.get(
  "/:id/pdf",
  validateRequest({ params: prescriptionParamsSchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(getPrescriptionPdf)
);
