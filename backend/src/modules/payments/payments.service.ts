import { Prisma, type Payment } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { compareDecimals, decimalToString, toDecimal } from "../../lib/decimal";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { PaymentInput, PaymentListQuery, PaymentSummaryQuery, PaymentUpdateInput } from "./payments.validation";

type SerializedPayment = Omit<Payment, "totalAmount" | "paidAmount" | "remainingAmount"> & {
  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;
};

function serializePayment(payment: Payment): SerializedPayment {
  return {
    ...payment,
    totalAmount: decimalToString(payment.totalAmount),
    paidAmount: decimalToString(payment.paidAmount),
    remainingAmount: decimalToString(payment.remainingAmount)
  };
}

function buildDateRangeFilter(from?: string, to?: string) {
  if (!from && !to) {
    return undefined;
  }

  const filter: Prisma.DateTimeFilter = {};

  if (from) {
    filter.gte = new Date(from);
  }

  if (to) {
    const end = new Date(to);
    end.setUTCDate(end.getUTCDate() + 1);
    filter.lt = end;
  }

  return filter;
}

async function findPaymentOrThrow(id: string) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) {
    throw new AppError(404, "Payment not found");
  }

  return payment;
}

async function ensureActivePatient(patientId: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient || !patient.isActive) {
    throw new AppError(400, "Active patient is required");
  }
}

async function ensureActiveClinic(clinicId: string) {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic || !clinic.isActive) {
    throw new AppError(400, "Active clinic is required");
  }
}

async function ensureVisitMatches(visitId: string, patientId: string, clinicId: string) {
  const visit = await prisma.visit.findUnique({ where: { id: visitId } });
  if (!visit) {
    throw new AppError(404, "Visit not found");
  }

  if (visit.patientId !== patientId || visit.clinicId !== clinicId) {
    throw new AppError(400, "Visit must belong to the patient and clinic");
  }
}

function calculateRemaining(totalAmount: string, paidAmount: string) {
  const total = toDecimal(totalAmount);
  const paid = toDecimal(paidAmount);

  if (total.isNegative()) {
    throw new AppError(400, "Total amount must be zero or greater");
  }

  if (paid.isNegative()) {
    throw new AppError(400, "Paid amount must be zero or greater");
  }

  if (compareDecimals(paid, total) > 0) {
    throw new AppError(400, "Paid amount cannot exceed total amount");
  }

  return total.minus(paid);
}

export class PaymentsService {
  async list(query: PaymentListQuery) {
    const pagination = getPagination(query);
    const where: Prisma.PaymentWhereInput = {
      ...(query.patientId ? { patientId: query.patientId } : {}),
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(query.visitId ? { visitId: query.visitId } : {}),
      ...(query.receivedByUserId ? { receivedByUserId: query.receivedByUserId } : {}),
      ...(query.method ? { method: query.method } : {}),
      ...(buildDateRangeFilter(query.from, query.to) ? { paidAt: buildDateRangeFilter(query.from, query.to) } : {})
    };

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { paidAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.payment.count({ where })
    ]);

    return toPaginatedData(items.map(serializePayment), pagination, total);
  }

  async create(input: PaymentInput, receivedByUserId: string) {
    await ensureActivePatient(input.patientId);
    await ensureActiveClinic(input.clinicId);

    if (input.visitId) {
      await ensureVisitMatches(input.visitId, input.patientId, input.clinicId);
    }

    const remainingAmount = calculateRemaining(input.totalAmount, input.paidAmount);

    return serializePayment(
      await prisma.payment.create({
        data: {
          patientId: input.patientId,
          visitId: input.visitId,
          clinicId: input.clinicId,
          receivedByUserId,
          totalAmount: toDecimal(input.totalAmount),
          paidAmount: toDecimal(input.paidAmount),
          remainingAmount,
          method: input.method,
          paidAt: input.paidAt ?? new Date(),
          notes: input.notes
        }
      })
    );
  }

  async get(id: string) {
    return serializePayment(await findPaymentOrThrow(id));
  }

  async update(id: string, input: PaymentUpdateInput, changedByUserId: string) {
    const current = await findPaymentOrThrow(id);
    await ensureActivePatient(current.patientId);
    await ensureActiveClinic(current.clinicId);
    if (current.visitId) {
      await ensureVisitMatches(current.visitId, current.patientId, current.clinicId);
    }

    const nextTotal = input.totalAmount ?? decimalToString(current.totalAmount);
    const nextPaid = input.paidAmount ?? decimalToString(current.paidAmount);
    const nextMethod = input.method ?? current.method;
    const nextRemaining = calculateRemaining(nextTotal, nextPaid);

    await prisma.paymentRevision.create({
      data: {
        paymentId: id,
        changedByUserId,
        totalAmount: current.totalAmount,
        paidAmount: current.paidAmount,
        remainingAmount: current.remainingAmount,
        method: current.method,
        reason: input.reason
      }
    });

    return serializePayment(
      await prisma.payment.update({
        where: { id },
        data: {
          totalAmount: toDecimal(nextTotal),
          paidAmount: toDecimal(nextPaid),
          remainingAmount: nextRemaining,
          method: nextMethod,
          notes: input.notes ?? current.notes
        }
      })
    );
  }

  async summary(query: PaymentSummaryQuery) {
    const where: Prisma.PaymentWhereInput = {
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(buildDateRangeFilter(query.from, query.to) ? { paidAt: buildDateRangeFilter(query.from, query.to) } : {})
    };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        clinic: true
      },
      orderBy: { paidAt: "desc" }
    });

    const totalReceived = payments.reduce((sum, payment) => sum.plus(payment.paidAmount), toDecimal(0));
    const totalOutstanding = payments.reduce((sum, payment) => sum.plus(payment.remainingAmount), toDecimal(0));
    const byClinic = new Map<string, { clinicId: string; clinicName: string; totalReceived: Prisma.Decimal; totalOutstanding: Prisma.Decimal; paymentCount: number }>();

    for (const payment of payments) {
      const current = byClinic.get(payment.clinicId) ?? {
        clinicId: payment.clinicId,
        clinicName: payment.clinic.name,
        totalReceived: toDecimal(0),
        totalOutstanding: toDecimal(0),
        paymentCount: 0
      };

      current.totalReceived = current.totalReceived.plus(payment.paidAmount);
      current.totalOutstanding = current.totalOutstanding.plus(payment.remainingAmount);
      current.paymentCount += 1;
      byClinic.set(payment.clinicId, current);
    }

    return {
      totalPayments: payments.length,
      totalReceived: decimalToString(totalReceived),
      totalOutstanding: decimalToString(totalOutstanding),
      byClinic: Array.from(byClinic.values()).map((entry) => ({
        ...entry,
        totalReceived: decimalToString(entry.totalReceived),
        totalOutstanding: decimalToString(entry.totalOutstanding)
      }))
    };
  }
}

export const paymentsService = new PaymentsService();
