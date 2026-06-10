import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken, mockAuthenticatedUsers } from "../helpers/auth-fixtures";
import {
  clinicFixture,
  doctorUser,
  patientFixture,
  prescriptionFixture,
  secretaryUser,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  mockAuthenticatedUsers([doctorUser, secretaryUser]);
  const app = createApp();

  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.visit as any).findUnique = async () => visitFixture;

  await request(app)
    .post(`/api/patients/${patientFixture.id}/visits`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      clinicId: clinicFixture.id,
      visitDate: "2026-06-11T09:00:00.000Z",
      diagnosis: "Diagnosis",
      treatment: "Treatment"
    })
    .expect(403);

  await request(app)
    .patch(`/api/visits/${visitFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      diagnosis: "Updated",
      reason: "Correction"
    })
    .expect(403);

  await request(app)
    .post(`/api/visits/${visitFixture.id}/prescriptions`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      medications: prescriptionFixture.medications,
      instructions: "Take after meals"
    })
    .expect(403);

  await request(app)
    .patch(`/api/prescriptions/${prescriptionFixture.id}`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({
      instructions: "Updated instructions",
      reason: "Correction"
    })
    .expect(403);
}
