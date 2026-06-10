import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { createVisit, getVisit, listVisits, updateVisit } from "./visits.controller";
import {
  visitCollectionParamsSchema,
  visitInputSchema,
  visitListQuerySchema,
  visitParamsSchema,
  visitUpdateSchema
} from "./visits.validation";

export const visitsRouter = Router({ mergeParams: true });

visitsRouter.use(authenticate, requireRole(Role.DOCTOR, Role.SECRETARY));

visitsRouter.get(
  "/",
  validateRequest({ params: visitCollectionParamsSchema, query: visitListQuerySchema }),
  asyncHandler(listVisits)
);
visitsRouter.post(
  "/",
  validateRequest({ params: visitCollectionParamsSchema, body: visitInputSchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(createVisit)
);
visitsRouter.get("/:id", validateRequest({ params: visitParamsSchema }), asyncHandler(getVisit));
visitsRouter.patch(
  "/:id",
  validateRequest({ params: visitParamsSchema, body: visitUpdateSchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(updateVisit)
);
