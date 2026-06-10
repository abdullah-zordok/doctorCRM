import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken } from "../helpers/auth-fixtures";
import { clinicFixture, patientFixture, secretaryUser } from "../helpers/admin-fixtures";

export async function run() {
  (prisma.user as any).findUnique = async () => secretaryUser;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.patient as any).findMany = async () => [patientFixture];
  (prisma.patient as any).count = async () => 1;
  (prisma.patient as any).create = async ({ data }: any) => ({ id: "patient_created", ...data, isActive: true, createdAt: new Date(), updatedAt: new Date() });
  (prisma.patient as any).update = async ({ data }: any) => ({ ...patientFixture, ...data, updatedAt: new Date() });

  const app = createApp();

  await request(app)
    .post("/api/patients")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ name: "Ahmed Ali", phone: "0500000000", clinicId: clinicFixture.id })
    .expect(201);

  const searchResponse = await request(app)
    .get(`/api/patients?search=0500&clinicId=${clinicFixture.id}&isActive=true&page=1&pageSize=20`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .expect(200);

  assert.equal(searchResponse.body.data.items.length, 1);

  await request(app)
    .patch(`/api/patients/${patientFixture.id}/status`)
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ isActive: false })
    .expect(200);
}
