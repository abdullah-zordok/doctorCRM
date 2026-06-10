import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import {
  changeSecretaryStatus,
  createSecretary,
  getSecretary,
  listSecretaries,
  updateSecretary
} from "./secretaries.controller";
import {
  createSecretarySchema,
  secretaryListQuerySchema,
  secretaryParamsSchema,
  secretaryStatusSchema,
  updateSecretarySchema
} from "./secretaries.validation";

export const secretariesRouter = Router();

secretariesRouter.use(authenticate, requireRole(Role.DOCTOR));

secretariesRouter.get("/", validateRequest({ query: secretaryListQuerySchema }), asyncHandler(listSecretaries));
secretariesRouter.post("/", validateRequest({ body: createSecretarySchema }), asyncHandler(createSecretary));
secretariesRouter.get("/:id", validateRequest({ params: secretaryParamsSchema }), asyncHandler(getSecretary));
secretariesRouter.patch(
  "/:id",
  validateRequest({ params: secretaryParamsSchema, body: updateSecretarySchema }),
  asyncHandler(updateSecretary)
);
secretariesRouter.patch(
  "/:id/status",
  validateRequest({ params: secretaryParamsSchema, body: secretaryStatusSchema }),
  asyncHandler(changeSecretaryStatus)
);
