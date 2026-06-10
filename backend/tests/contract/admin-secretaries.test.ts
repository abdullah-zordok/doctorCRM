import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { doctorToken, secretaryToken } from "../helpers/auth-fixtures";
import { doctorUser, secretaryUser, withPasswordHash } from "../helpers/admin-fixtures";

const app = createApp();

async function mockSecretaryDelegates() {
  const storedSecretary = await withPasswordHash(secretaryUser);

  (prisma.user as any).findUnique = async ({ where }: { where: { id?: string; email?: string } }) => {
    if (where.id === doctorUser.id) return doctorUser;
    if (where.id === secretaryUser.id) return secretaryUser;
    if (where.email === storedSecretary.email) return storedSecretary;
    return null;
  };
  (prisma.user as any).findFirst = async ({ where }: { where: { id?: string } }) =>
    where.id === secretaryUser.id ? storedSecretary : null;
  (prisma.user as any).findMany = async () => [storedSecretary];
  (prisma.user as any).count = async () => 1;
  (prisma.user as any).create = async ({ data }: any) => ({
    id: "secretary_created",
    ...data,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  (prisma.user as any).update = async ({ where, data }: any) => ({
    ...storedSecretary,
    id: where.id,
    ...data,
    updatedAt: new Date()
  });
}

export async function run() {
  await mockSecretaryDelegates();

  const listResponse = await request(app)
    .get("/api/users/secretaries?page=1&pageSize=20")
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);

  assert.equal(listResponse.body.success, true);
  assert.equal(listResponse.body.data.meta.total, 1);
  assert.equal(listResponse.body.data.items[0].role, "SECRETARY");

  const createResponse = await request(app)
    .post("/api/users/secretaries")
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ email: "new-secretary@example.com", name: "New Secretary", password: "StrongPass123" })
    .expect(201);

  assert.equal(createResponse.body.data.role, "SECRETARY");
  assert.equal(createResponse.body.data.passwordHash, undefined);

  const getResponse = await request(app)
    .get(`/api/users/secretaries/${secretaryUser.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .expect(200);
  assert.equal(getResponse.body.data.id, secretaryUser.id);

  const updateResponse = await request(app)
    .patch(`/api/users/secretaries/${secretaryUser.id}`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ name: "Updated Secretary" })
    .expect(200);
  assert.equal(updateResponse.body.data.name, "Updated Secretary");

  const statusResponse = await request(app)
    .patch(`/api/users/secretaries/${secretaryUser.id}/status`)
    .set("Authorization", `Bearer ${doctorToken}`)
    .send({ isActive: false })
    .expect(200);
  assert.equal(statusResponse.body.data.isActive, false);

  await request(app)
    .post("/api/users/secretaries")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ email: "blocked@example.com", name: "Blocked", password: "StrongPass123" })
    .expect(403);
}
