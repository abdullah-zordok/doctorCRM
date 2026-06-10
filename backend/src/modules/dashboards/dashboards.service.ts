import { Prisma } from "@prisma/client";
import { decimalToString, toDecimal } from "../../lib/decimal";
import { prisma } from "../../lib/prisma";
import type { DashboardQuery } from "./dashboards.validation";

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

function buildTodayRange(now = new Date()) {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { gte: start, lt: end };
}

function clinicFilter(clinicId?: string) {
  return clinicId ? { clinicId } : {};
}

function sumDecimal(values: Array<string | Prisma.Decimal>) {
  return values.reduce<Prisma.Decimal>((sum, value) => sum.plus(value), toDecimal(0));
}

export class DashboardsService {
  async doctorSummary(query: DashboardQuery) {
    const today = buildTodayRange();
    const range = buildDateRangeFilter(query.from, query.to);

    const [totalPatients, totalVisits, todayAppointments, todayPayments, paymentsInRange] = await Promise.all([
      prisma.patient.count({
        where: {
          isActive: true,
          ...clinicFilter(query.clinicId)
        }
      }),
      prisma.visit.count({
        where: {
          ...(query.clinicId ? { clinicId: query.clinicId } : {}),
          ...(range ? { visitDate: range } : {})
        }
      }),
      prisma.appointment.findMany({
        where: {
          scheduledAt: today,
          ...clinicFilter(query.clinicId)
        },
        orderBy: { scheduledAt: "asc" }
      }),
      prisma.payment.findMany({
        where: {
          paidAt: today,
          ...clinicFilter(query.clinicId)
        }
      }),
      prisma.payment.findMany({
        where: {
          ...(query.clinicId ? { clinicId: query.clinicId } : {}),
          ...(range ? { paidAt: range } : {})
        },
        include: {
          clinic: true
        }
      })
    ]);

    const revenuePerClinic = new Map<string, { clinicId: string; clinicName: string; totalRevenue: Prisma.Decimal; totalOutstanding: Prisma.Decimal }>();

    for (const payment of paymentsInRange) {
      const current = revenuePerClinic.get(payment.clinicId) ?? {
        clinicId: payment.clinicId,
        clinicName: payment.clinic.name,
        totalRevenue: toDecimal(0),
        totalOutstanding: toDecimal(0)
      };

      current.totalRevenue = current.totalRevenue.plus(payment.paidAmount);
      current.totalOutstanding = current.totalOutstanding.plus(payment.remainingAmount);
      revenuePerClinic.set(payment.clinicId, current);
    }

    const todayRevenue = sumDecimal(todayPayments.map((payment) => payment.paidAmount));
    const outstandingBalances = sumDecimal(paymentsInRange.map((payment) => payment.remainingAmount));

    return {
      totalPatients,
      totalVisits,
      todayAppointments: todayAppointments.length,
      todayRevenue: decimalToString(todayRevenue),
      outstandingBalances: decimalToString(outstandingBalances),
      revenuePerClinic: Array.from(revenuePerClinic.values()).map((entry) => ({
        ...entry,
        totalRevenue: decimalToString(entry.totalRevenue),
        totalOutstanding: decimalToString(entry.totalOutstanding)
      }))
    };
  }

  async doctorRevenue(query: DashboardQuery) {
    const range = buildDateRangeFilter(query.from, query.to);
    const payments = await prisma.payment.findMany({
      where: {
        ...(query.clinicId ? { clinicId: query.clinicId } : {}),
        ...(range ? { paidAt: range } : {})
      },
      include: {
        clinic: true
      },
      orderBy: { paidAt: "desc" }
    });

    const totalRevenue = sumDecimal(payments.map((payment) => payment.paidAmount));
    const totalOutstanding = sumDecimal(payments.map((payment) => payment.remainingAmount));
    const revenuePerClinic = new Map<string, { clinicId: string; clinicName: string; totalRevenue: Prisma.Decimal; totalOutstanding: Prisma.Decimal }>();

    for (const payment of payments) {
      const current = revenuePerClinic.get(payment.clinicId) ?? {
        clinicId: payment.clinicId,
        clinicName: payment.clinic.name,
        totalRevenue: toDecimal(0),
        totalOutstanding: toDecimal(0)
      };

      current.totalRevenue = current.totalRevenue.plus(payment.paidAmount);
      current.totalOutstanding = current.totalOutstanding.plus(payment.remainingAmount);
      revenuePerClinic.set(payment.clinicId, current);
    }

    return {
      totalPayments: payments.length,
      totalRevenue: decimalToString(totalRevenue),
      totalOutstanding: decimalToString(totalOutstanding),
      revenuePerClinic: Array.from(revenuePerClinic.values()).map((entry) => ({
        ...entry,
        totalRevenue: decimalToString(entry.totalRevenue),
        totalOutstanding: decimalToString(entry.totalOutstanding)
      }))
    };
  }

  async doctorTodayAppointments(query: DashboardQuery) {
    const appointments = await prisma.appointment.findMany({
      where: {
        scheduledAt: buildTodayRange(),
        ...clinicFilter(query.clinicId)
      },
      include: {
        patient: true,
        clinic: true
      },
      orderBy: { scheduledAt: "asc" }
    });

    return {
      total: appointments.length,
      items: appointments
    };
  }

  async secretarySummary(query: DashboardQuery) {
    const today = buildTodayRange();
    const [todayAppointments, todayPatients, todayPayments, paymentsInRange] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          scheduledAt: today,
          ...clinicFilter(query.clinicId)
        },
        include: {
          patient: true,
          clinic: true
        },
        orderBy: { scheduledAt: "asc" }
      }),
      prisma.patient.findMany({
        where: {
          createdAt: today,
          isActive: true,
          ...clinicFilter(query.clinicId)
        }
      }),
      prisma.payment.findMany({
        where: {
          paidAt: today,
          ...clinicFilter(query.clinicId)
        }
      }),
      prisma.payment.findMany({
        where: {
          ...(query.clinicId ? { clinicId: query.clinicId } : {})
        }
      })
    ]);

    return {
      todayAppointments: todayAppointments.length,
      todayRegisteredPatients: todayPatients.length,
      todayPayments: decimalToString(sumDecimal(todayPayments.map((payment) => payment.paidAmount))),
      outstandingBalances: decimalToString(sumDecimal(paymentsInRange.map((payment) => payment.remainingAmount)))
    };
  }

  async secretaryTodayAppointments(query: DashboardQuery) {
    const result = await this.doctorTodayAppointments(query);
    return result;
  }
}

export const dashboardsService = new DashboardsService();
