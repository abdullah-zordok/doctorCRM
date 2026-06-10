import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken } from "../helpers/auth-fixtures";
import { clinicFixture, doctorUser, secretaryUser, withPasswordHash } from "../helpers/admin-fixtures";

export async function run() {
  const app = createApp();
  const storedSecretary = await withPasswordHash(secretaryUser);

  (prisma.user as any).findUnique = async ({ where }: { where: { id?: string; email?: string } }) => {
    if (where.id === doctorUser.id) return doctorUser;
    if (where.id === secretaryUser.id || where.email === secretaryUser.email) return storedSecretary;
    return null;
  };
  (prisma.user as any).findFirst = async () => storedSecretary;
  (prisma.user as any).findMany = async () => [storedSecretary];
  (prisma.user as any).count = async () => 1;
  (prisma.user as any).create = async ({ data }: any) => ({ id: "secretary_created", ...data, isActive: true, createdAt: new Date(), updatedAt: new Date() });
  (prisma.user as any).update = async ({ data }: any) => ({ ...storedSecretary, ...data, updatedAt: new Date() });
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  (prisma.clinic as any).findMany = async () => [clinicFixture];
  (prisma.clinic as any).count = async () => 1;
  (prisma.clinic as any).create = async ({ data }: any) => ({ id: "clinic_created", ...data, isActive: true, createdAt: new Date(), updatedAt: new Date() });
  (prisma.clinic as any).update = async ({ data }: any) => ({ ...clinicFixture, ...data, updatedAt: new Date() });

  const secretary = await request(app)
    .post("/api/users/secretaries")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ email: "created-secretary@example.com", name: "Created Secretary", password: "StrongPass123" })
    .expect(201);
  assert.equal(secretary.body.data.role, "SECRETARY");

  const clinic = await request(app)
    .post("/api/clinics")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ name: "Created Clinic" })
    .expect(201);
  assert.equal(clinic.body.data.isActive, true);
}
