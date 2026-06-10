import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, secretaryToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  doctorUser,
  patientFixture,
  secretaryUser,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser, secretaryUser]);
  const app = createApp();

  (prisma.patient as any).findUnique = async ({ where }: any) => (where.id === patientFixture.id ? patientFixture : null);
  (prisma.clinic as any).findUnique = async ({ where }: any) => (where.id === clinicFixture.id ? clinicFixture : null);
  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.visit as any).findMany = async () => [visitFixture];
  (prisma.visit as any).count = async () => 1;
  (prisma.visit as any).create = async ({ data }: any) => ({ ...visitFixture, ...data, id: "visit_created" });
  (prisma.visit as any).update = async ({ data }: any) => ({ ...visitFixture, ...data });
  (prisma.visitRevision as any).create = async ({ data }: any) => data;

  const listResponse = await request(app)
    .get(`/api/patients/${patientFixture.id}/visits?page=1&pageSize=20`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(listResponse.body.data.items[0].id, visitFixture.id);

  const createResponse = await request(app)
    .post(`/api/patients/${patientFixture.id}/visits`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      clinicId: clinicFixture.id,
      visitDate: "2026-06-11T09:00:00.000Z",
      diagnosis: "Acute bronchitis",
      treatment: "Rest and medication",
      notes: "Initial note"
    })
    .expect(201);
  assert.equal(createResponse.body.data.diagnosis, "Acute bronchitis");

  const getResponse = await request(app)
    .get(`/api/visits/${visitFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);
  assert.equal(getResponse.body.data.id, visitFixture.id);

  const updateResponse = await request(app)
    .patch(`/api/visits/${visitFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      diagnosis: "Corrected diagnosis",
      treatment: "Corrected treatment",
      reason: "Correction required"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.diagnosis, "Corrected diagnosis");
}
