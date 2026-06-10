import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  doctorUser,
  patientFixture,
  prescriptionFixture,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser]);
  const app = createApp();

  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.prescription as any).findUnique = async ({ where, include }: any) => {
    if (where.id !== prescriptionFixture.id) {
      return null;
    }

    if (include) {
      return {
        ...prescriptionFixture,
        visit: {
          ...visitFixture,
          patient: patientFixture,
          clinic: clinicFixture
        },
        doctor: doctorUser
      };
    }

    return prescriptionFixture;
  };
  (prisma.prescription as any).create = async ({ data }: any) => ({ ...prescriptionFixture, ...data, id: "prescription_created" });
  (prisma.prescription as any).update = async ({ data }: any) => ({ ...prescriptionFixture, ...data });
  (prisma.prescriptionRevision as any).create = async ({ data }: any) => data;

  const createResponse = await request(app)
    .post(`/api/visits/${visitFixture.id}/prescriptions`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      medications: prescriptionFixture.medications,
      instructions: "Take after meals"
    })
    .expect(201);
  assert.equal(createResponse.body.data.id, "prescription_created");

  const getResponse = await request(app)
    .get(`/api/prescriptions/${prescriptionFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.equal(getResponse.body.data.id, prescriptionFixture.id);

  const updateResponse = await request(app)
    .patch(`/api/prescriptions/${prescriptionFixture.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      instructions: "Take before meals",
      reason: "Instruction correction"
    })
    .expect(200);
  assert.equal(updateResponse.body.data.instructions, "Take before meals");

  const pdfResponse = await request(app)
    .get(`/api/prescriptions/${prescriptionFixture.id}/pdf`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.match(String(pdfResponse.headers["content-type"]), /application\/pdf/);
  assert.ok(pdfResponse.body.length > 0);
}
