import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";

const app = createApp();

export async function run() {
  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    passwordHash: await bcrypt.hash("ChangeMe123!", 12),
    role: "DOCTOR",
    isActive: true
  });

  const loginResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "doctor@example.com", password: "ChangeMe123!" })
    .expect(200);

  assert.equal(loginResponse.body.success, true);
  assert.equal(typeof loginResponse.body.data.accessToken, "string");
  assert.deepEqual(loginResponse.body.data.user, {
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    role: "DOCTOR",
    isActive: true
  });

  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    passwordHash: await bcrypt.hash("Different123!", 12),
    role: "DOCTOR",
    isActive: true
  });

  const invalidPasswordResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "doctor@example.com", password: "ChangeMe123!" })
    .expect(401);

  assert.deepEqual(invalidPasswordResponse.body, {
    success: false,
    message: "Invalid credentials",
    errors: []
  });

  const invalidEmailResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "bad-email", password: "ChangeMe123!" })
    .expect(400);

  assert.equal(invalidEmailResponse.body.success, false);
  assert.equal(invalidEmailResponse.body.message, "Validation error");

  const missingPasswordResponse = await request(app)
    .post("/api/auth/login")
    .send({ email: "doctor@example.com" })
    .expect(400);

  assert.equal(missingPasswordResponse.body.success, false);
  assert.equal(missingPasswordResponse.body.message, "Validation error");
}
