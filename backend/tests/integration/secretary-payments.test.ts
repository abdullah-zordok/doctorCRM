import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  paymentFixture,
  patientFixture,
  secretaryUser,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([secretaryUser]);
  const app = createApp();
  let revisionPayload: any = null;

  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.visit as any).findUnique = async () => visitFixture;
  (prisma.payment as any).findUnique = async () => paymentFixture;
  (prisma.payment as any).create = async ({ data }: any) => ({ ...paymentFixture, ...data, id: "payment_created" });
  (prisma.payment as any).update = async ({ data }: any) => ({ ...paymentFixture, ...data });
  (prisma.paymentRevision as any).create = async (payload: any) => {
    revisionPayload = payload;
    return payload.data;
  };

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

  await request(app)
    .post("/api/payments")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      patientId: patientFixture.id,
      clinicId: clinicFixture.id,
      totalAmount: "100.00",
      paidAmount: "150.00",
      method: "CASH"
    })
    .expect(400);

  const updateResponse = await request(app)
    .patch(`/api/payments/${paymentFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      paidAmount: "150.00",
      reason: "Corrected receipt"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.remainingAmount, "150.00");
  assert.equal(revisionPayload.data.reason, "Corrected receipt");
}
