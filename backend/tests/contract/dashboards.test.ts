import assert from "node:assert/strict";
import { Prisma } from "@prisma/client";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, secretaryToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import { clinicFixture, doctorUser, paymentFixture, patientFixture, secretaryUser } from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser, secretaryUser]);
  const app = createApp();
  const appointment = {
    id: "appointment_dashboard",
    patientId: patientFixture.id,
    clinicId: clinicFixture.id,
    scheduledAt: new Date("2026-06-10T09:00:00.000Z"),
    status: "SCHEDULED",
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    patient: patientFixture,
    clinic: clinicFixture
  };
  const payment = {
    ...paymentFixture,
    paidAmount: new Prisma.Decimal("200.00"),
    remainingAmount: new Prisma.Decimal("100.00"),
    clinic: clinicFixture
  };

  (prisma.patient as any).count = async () => 2;
  (prisma.patient as any).findMany = async () => [patientFixture];
  (prisma.visit as any).count = async () => 3;
  (prisma.appointment as any).findMany = async () => [appointment];
  (prisma.payment as any).findMany = async ({ include, where }: any) => {
    if (include) return [payment];
    if (where?.paidAt) return [payment];
    return [payment];
  };

  const doctorSummary = await request(app)
    .get(`/api/dashboard/doctor/summary?clinicId=${clinicFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.equal(doctorSummary.body.data.totalPatients, 2);

  const doctorRevenue = await request(app)
    .get(`/api/dashboard/doctor/revenue?clinicId=${clinicFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.equal(doctorRevenue.body.data.totalRevenue, "200.00");

  const secretarySummary = await request(app)
    .get(`/api/dashboard/secretary/summary?clinicId=${clinicFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(secretarySummary.body.data.todayPayments, "200.00");

  const secretaryAppointments = await request(app)
    .get(`/api/dashboard/secretary/today-appointments?clinicId=${clinicFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(secretaryAppointments.body.data.total, 1);
}
