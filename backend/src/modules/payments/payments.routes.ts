import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import {
  createPayment,
  getPayment,
  getPaymentSummary,
  listPayments,
  updatePayment
} from "./payments.controller";
import {
  paymentInputSchema,
  paymentListQuerySchema,
  paymentParamsSchema,
  paymentSummaryQuerySchema,
  paymentUpdateSchema
} from "./payments.validation";

export const paymentsRouter = Router();

paymentsRouter.use(authenticate, requireRole(Role.DOCTOR, Role.SECRETARY));

paymentsRouter.get("/", validateRequest({ query: paymentListQuerySchema }), asyncHandler(listPayments));
paymentsRouter.post("/", validateRequest({ body: paymentInputSchema }), asyncHandler(createPayment));
paymentsRouter.get("/:id", validateRequest({ params: paymentParamsSchema }), asyncHandler(getPayment));
paymentsRouter.patch(
  "/:id",
  validateRequest({ params: paymentParamsSchema, body: paymentUpdateSchema }),
  asyncHandler(updatePayment)
);
paymentsRouter.get(
  "/reports/summary",
  validateRequest({ query: paymentSummaryQuerySchema }),
  requireRole(Role.DOCTOR),
  asyncHandler(getPaymentSummary)
);
