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

  (prisma.patient as any).count = async () => 1;
  (prisma.patient as any).findMany = async () => [patientFixture];
  (prisma.visit as any).count = async () => 1;
  (prisma.appointment as any).findMany = async () => [appointment];
  (prisma.payment as any).findMany = async () => [payment];

  await request(app)
    .get("/api/dashboard/doctor/summary")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);

  await request(app)
    .get("/api/dashboard/secretary/summary")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);

  await request(app)
    .get("/api/dashboard/doctor/revenue")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(403);

  await request(app)
    .get("/api/dashboard/secretary/summary")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(403);
}
