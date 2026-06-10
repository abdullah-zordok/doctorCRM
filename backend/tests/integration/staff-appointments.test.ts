import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken } from "../helpers/auth-fixtures";
import { appointmentFixture, clinicFixture, patientFixture, secretaryUser } from "../helpers/admin-fixtures";

export async function run() {
  (prisma.user as any).findUnique = async () => secretaryUser;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.appointment as any).findUnique = async () => appointmentFixture;
  (prisma.appointment as any).findMany = async () => [appointmentFixture];
  (prisma.appointment as any).count = async () => 1;
  (prisma.appointment as any).create = async ({ data }: any) => ({ id: "appointment_created", ...data, createdAt: new Date(), updatedAt: new Date() });
  (prisma.appointment as any).update = async ({ data }: any) => ({ ...appointmentFixture, ...data, updatedAt: new Date() });

  const app = createApp();

  await request(app)
    .post("/api/appointments")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ patientId: patientFixture.id, clinicId: clinicFixture.id, scheduledAt: "2026-06-11T09:00:00.000Z" })
    .expect(201);

  const listResponse = await request(app)
    .get(`/api/appointments?date=2026-06-11&clinicId=${clinicFixture.id}&patientId=${patientFixture.id}&status=SCHEDULED`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.meta.total, 1);

  const cancelResponse = await request(app)
    .patch(`/api/appointments/${appointmentFixture.id}/status`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ status: "CANCELLED" })
    .expect(200);
  assert.equal(cancelResponse.body.data.status, "CANCELLED");
}
