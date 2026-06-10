import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, secretaryToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  doctorUser,
  paymentFixture,
  patientFixture,
  secretaryUser,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser, secretaryUser]);
  const app = createApp();
  const paymentWithClinic = { ...paymentFixture, clinic: clinicFixture };

  (prisma.patient as any).findUnique = async ({ where }: any) => (where.id === patientFixture.id ? patientFixture : null);
  (prisma.clinic as any).findUnique = async ({ where }: any) => (where.id === clinicFixture.id ? clinicFixture : null);
  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.payment as any).findUnique = async ({ where }: any) => (where.id === paymentFixture.id ? paymentFixture : null);
  (prisma.payment as any).findMany = async ({ include }: any) => (include ? [paymentWithClinic] : [paymentFixture]);
  (prisma.payment as any).count = async () => 1;
  (prisma.payment as any).create = async ({ data }: any) => ({ ...paymentFixture, ...data, id: "payment_created" });
  (prisma.payment as any).update = async ({ data }: any) => ({ ...paymentFixture, ...data });
  (prisma.paymentRevision as any).create = async ({ data }: any) => data;

  const listResponse = await request(app)
    .get(`/api/payments?patientId=${patientFixture.id}&clinicId=${clinicFixture.id}&page=1&pageSize=20`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.meta.total, 1);

  const createResponse = await request(app)
    .post("/api/payments")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      patientId: patientFixture.id,
      visitId: visitFixture.id,
      clinicId: clinicFixture.id,
      totalAmount: "300.00",
      paidAmount: "200.00",
      method: "CASH"
    })
    .expect(201);
  assert.equal(createResponse.body.data.remainingAmount, "100.00");

  const getResponse = await request(app)
    .get(`/api/payments/${paymentFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(getResponse.body.data.id, paymentFixture.id);

  const updateResponse = await request(app)
    .patch(`/api/payments/${paymentFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      paidAmount: "150.00",
      reason: "Corrected paid amount"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.remainingAmount, "150.00");

  const summaryResponse = await request(app)
    .get("/api/payments/reports/summary")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.equal(summaryResponse.body.data.totalReceived, "200.00");

  await request(app)
    .get("/api/payments/reports/summary")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(403);
}
