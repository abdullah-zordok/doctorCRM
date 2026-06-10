import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken } from "../helpers/auth-fixtures";
import { clinicFixture, patientFixture, secretaryUser } from "../helpers/admin-fixtures";

const app = createApp();

function mockPatientDelegates() {
  (prisma.user as any).findUnique = async () => secretaryUser;
  (prisma.clinic as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === clinicFixture.id ? clinicFixture : null;
  (prisma.patient as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === patientFixture.id ? patientFixture : null;
  (prisma.patient as any).findMany = async () => [patientFixture];
  (prisma.patient as any).count = async () => 1;
  (prisma.patient as any).create = async ({ data }: any) => ({
    id: "patient_created",
    ...data,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  (prisma.patient as any).update = async ({ where, data }: any) => ({
    ...patientFixture,
    id: where.id,
    ...data,
    updatedAt: new Date()
  });
}

export async function run() {
  mockPatientDelegates();

  const createResponse = await request(app)
    .post("/api/patients")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ name: "Ahmed Ali", phone: "0500000000", clinicId: clinicFixture.id })
    .expect(201);
  assert.equal(createResponse.body.data.name, "Ahmed Ali");

  const listResponse = await request(app)
    .get(`/api/patients?search=Ahmed&clinicId=${clinicFixture.id}&isActive=true&page=1&pageSize=20`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.meta.total, 1);

  const updateResponse = await request(app)
    .patch(`/api/patients/${patientFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ name: "Ahmed Updated", phone: "0500000000", clinicId: clinicFixture.id })
    .expect(200);
  assert.equal(updateResponse.body.data.name, "Ahmed Updated");

  const statusResponse = await request(app)
    .patch(`/api/patients/${patientFixture.id}/status`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ isActive: false })
    .expect(200);
  assert.equal(statusResponse.body.data.isActive, false);
}
