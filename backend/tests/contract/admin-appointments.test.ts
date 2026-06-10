import assert from "node:assert/strict";
import { AppointmentStatus } from "@prisma/client";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken } from "../helpers/auth-fixtures";
import { appointmentFixture, clinicFixture, patientFixture, secretaryUser } from "../helpers/admin-fixtures";

const app = createApp();

function mockAppointmentDelegates() {
  (prisma.user as any).findUnique = async () => secretaryUser;
  (prisma.clinic as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === clinicFixture.id ? clinicFixture : null;
  (prisma.patient as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === patientFixture.id ? patientFixture : null;
  (prisma.appointment as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === appointmentFixture.id ? appointmentFixture : null;
  (prisma.appointment as any).findMany = async () => [appointmentFixture];
  (prisma.appointment as any).count = async () => 1;
  (prisma.appointment as any).create = async ({ data }: any) => ({
    id: "appointment_created",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  (prisma.appointment as any).update = async ({ where, data }: any) => ({
    ...appointmentFixture,
    id: where.id,
    ...data,
    updatedAt: new Date()
  });
}

export async function run() {
  mockAppointmentDelegates();

  const createResponse = await request(app)
    .post("/api/appointments")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      patientId: patientFixture.id,
      clinicId: clinicFixture.id,
      scheduledAt: "2026-06-11T09:00:00.000Z"
    })
    .expect(201);
  assert.equal(createResponse.body.data.status, AppointmentStatus.SCHEDULED);

  const listResponse = await request(app)
    .get(`/api/appointments?date=2026-06-11&clinicId=${clinicFixture.id}&patientId=${patientFixture.id}&status=SCHEDULED`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.meta.total, 1);

  const updateResponse = await request(app)
    .patch(`/api/appointments/${appointmentFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      patientId: patientFixture.id,
      clinicId: clinicFixture.id,
      scheduledAt: "2026-06-11T10:00:00.000Z",
      status: "SCHEDULED"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.id, appointmentFixture.id);

  const statusResponse = await request(app)
    .patch(`/api/appointments/${appointmentFixture.id}/status`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ status: "CANCELLED" })
    .expect(200);
  assert.equal(statusResponse.body.data.status, AppointmentStatus.CANCELLED);
}
