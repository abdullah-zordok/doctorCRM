import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import { DashboardsService } from "../../src/modules/dashboards/dashboards.service";
import { clinicFixture, paymentFixture, patientFixture, visitFixture } from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  const service = new DashboardsService();

  const todayAppointments = [
    {
      id: "appointment_dashboard_1",
      patientId: patientFixture.id,
      clinicId: clinicFixture.id,
      scheduledAt: new Date("2026-06-10T09:00:00.000Z"),
      status: "SCHEDULED",
      notes: "Today appointment",
      createdAt: new Date(),
      updatedAt: new Date(),
      patient: patientFixture,
      clinic: clinicFixture
    }
  ];

  const payments = [
    {
      ...paymentFixture,
      paidAmount: new Prisma.Decimal("200.00"),
      remainingAmount: new Prisma.Decimal("100.00"),
      clinic: clinicFixture
    },
    {
      id: "payment_dashboard_2",
      patientId: patientFixture.id,
      visitId: visitFixture.id,
      clinicId: clinicFixture.id,
      receivedByUserId: paymentFixture.receivedByUserId,
      totalAmount: new Prisma.Decimal("150.00"),
      paidAmount: new Prisma.Decimal("50.00"),
      remainingAmount: new Prisma.Decimal("100.00"),
      method: paymentFixture.method,
      paidAt: new Date("2026-06-10T11:00:00.000Z"),
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      clinic: clinicFixture
    }
  ];

  (prisma.patient as any).count = async () => 2;
  (prisma.visit as any).count = async () => 3;
  (prisma.appointment as any).findMany = async () => todayAppointments;
  (prisma.payment as any).findMany = async ({ include, where }: any) => {
    if (include) {
      return payments;
    }

    if (where?.paidAt) {
      return [payments[0]];
    }

    return payments;
  };
  (prisma.patient as any).findMany = async () => [patientFixture];

  const summary = await service.doctorSummary({ clinicId: clinicFixture.id });
  assert.equal(summary.totalPatients, 2);
  assert.equal(summary.totalVisits, 3);
  assert.equal(summary.todayAppointments, 1);
  assert.equal(summary.todayRevenue, "200.00");
  assert.equal(summary.outstandingBalances, "200.00");
  assert.equal(summary.revenuePerClinic[0].totalRevenue, "250.00");

  const revenue = await service.doctorRevenue({ clinicId: clinicFixture.id });
  assert.equal(revenue.totalRevenue, "250.00");
  assert.equal(revenue.totalOutstanding, "200.00");

  const secretary = await service.secretarySummary({ clinicId: clinicFixture.id });
  assert.equal(secretary.todayAppointments, 1);
  assert.equal(secretary.todayRegisteredPatients, 1);
  assert.equal(secretary.todayPayments, "200.00");
  assert.equal(secretary.outstandingBalances, "200.00");

  const doctorAppointments = await service.doctorTodayAppointments({ clinicId: clinicFixture.id });
  assert.equal(doctorAppointments.total, 1);
  assert.equal(doctorAppointments.items[0].id, todayAppointments[0].id);
}
