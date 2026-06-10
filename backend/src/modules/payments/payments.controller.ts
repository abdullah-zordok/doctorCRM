import type { Request, Response } from "express";
import { sendCreated, sendSuccess } from "../../lib/responses";
import { paymentsService } from "./payments.service";
import type { PaymentInput, PaymentUpdateInput, PaymentListQuery, PaymentSummaryQuery } from "./payments.validation";

export async function listPayments(req: Request, res: Response) {
  const result = await paymentsService.list(req.query as unknown as PaymentListQuery);
  return sendSuccess(res, "Payments retrieved", result);
}

export async function createPayment(req: Request, res: Response) {
  const result = await paymentsService.create(req.body as PaymentInput, req.user!.id);
  return sendCreated(res, "Payment created", result);
}

export async function getPayment(req: Request, res: Response) {
  const result = await paymentsService.get(req.params.id);
  return sendSuccess(res, "Payment retrieved", result);
}

export async function updatePayment(req: Request, res: Response) {
  const result = await paymentsService.update(req.params.id, req.body as PaymentUpdateInput, req.user!.id);
  return sendSuccess(res, "Payment updated", result);
}

export async function getPaymentSummary(req: Request, res: Response) {
  const result = await paymentsService.summary(req.query as unknown as PaymentSummaryQuery);
  return sendSuccess(res, "Payment summary retrieved", result);
}
