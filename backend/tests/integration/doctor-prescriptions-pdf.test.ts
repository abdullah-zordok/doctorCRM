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

function extractPdfText(buffer: Buffer) {
  const raw = buffer.toString("latin1");
  return Array.from(raw.matchAll(/<([0-9a-fA-F]+)>/g))
    .map((match) => Buffer.from(match[1], "hex").toString("utf8"))
    .join("");
}

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

  await request(app)
    .post(`/api/visits/${visitFixture.id}/prescriptions`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({
      medications: prescriptionFixture.medications,
      instructions: "Take after meals"
    })
    .expect(201);

  const pdfResponse = await request(app)
    .get(`/api/prescriptions/${prescriptionFixture.id}/pdf`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);

  assert.match(String(pdfResponse.headers["content-type"]), /application\/pdf/);
  const pdfText = extractPdfText(pdfResponse.body);
  assert.match(pdfText, /Ahmed Ali/);
  assert.match(pdfText, /Amoxicillin/);
}
