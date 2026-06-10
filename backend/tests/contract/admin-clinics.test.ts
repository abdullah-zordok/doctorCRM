import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, secretaryToken } from "../helpers/auth-fixtures";
import { clinicFixture, doctorUser, secretaryUser } from "../helpers/admin-fixtures";

const app = createApp();

function mockClinicDelegates() {
  (prisma.user as any).findUnique = async ({ where }: { where: { id?: string } }) => {
    if (where.id === doctorUser.id) return doctorUser;
    if (where.id === secretaryUser.id) return secretaryUser;
    return null;
  };
  (prisma.clinic as any).findUnique = async ({ where }: { where: { id?: string } }) =>
    where.id === clinicFixture.id ? clinicFixture : null;
  (prisma.clinic as any).findMany = async () => [clinicFixture];
  (prisma.clinic as any).count = async () => 1;
  (prisma.clinic as any).create = async ({ data }: any) => ({
    id: "clinic_created",
    ...data,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  (prisma.clinic as any).update = async ({ where, data }: any) => ({
    ...clinicFixture,
    id: where.id,
    ...data,
    updatedAt: new Date()
  });
}

export async function run() {
  mockClinicDelegates();

  const listResponse = await request(app)
    .get("/api/clinics?page=1&pageSize=20")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.items[0].id, clinicFixture.id);

  const createResponse = await request(app)
    .post("/api/clinics")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ name: "New Clinic", phone: "+966511111111", address: "Riyadh" })
    .expect(201);
  assert.equal(createResponse.body.data.name, "New Clinic");

  const updateResponse = await request(app)
    .patch(`/api/clinics/${clinicFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ name: "Updated Clinic" })
    .expect(200);
  assert.equal(updateResponse.body.data.name, "Updated Clinic");

  const statusResponse = await request(app)
    .patch(`/api/clinics/${clinicFixture.id}/status`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ isActive: false })
    .expect(200);
  assert.equal(statusResponse.body.data.isActive, false);

  await request(app)
    .post("/api/clinics")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ name: "Blocked Clinic" })
    .expect(403);
}
