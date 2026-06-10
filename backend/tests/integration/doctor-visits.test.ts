import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  doctorUser,
  patientFixture,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser]);
  const app = createApp();
  let revisionPayload: any = null;

  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.visit as any).create = async ({ data }: any) => ({ ...visitFixture, ...data, id: "visit_created" });
  (prisma.visit as any).update = async ({ data }: any) => ({ ...visitFixture, ...data });
  (prisma.visitRevision as any).create = async (payload: any) => {
    revisionPayload = payload;
    return payload.data;
  };

  const createResponse = await request(app)
    .post(`/api/patients/${patientFixture.id}/visits`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      clinicId: clinicFixture.id,
      visitDate: "2026-06-11T09:00:00.000Z",
      diagnosis: "Acute bronchitis",
      treatment: "Rest and medication"
    })
    .expect(201);
  assert.equal(createResponse.body.data.id, "visit_created");

  const updateResponse = await request(app)
    .patch(`/api/visits/${visitFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      diagnosis: "Updated diagnosis",
      treatment: "Updated treatment",
      reason: "Correction required"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.diagnosis, "Updated diagnosis");
  assert.equal(revisionPayload.data.reason, "Correction required");
}
