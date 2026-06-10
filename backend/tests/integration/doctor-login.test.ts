import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { createApp } from "../../src/app";

export async function run() {
  (prisma.user as any).findUnique = async () => ({
    id: "seed_doctor",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    passwordHash: await bcrypt.hash("ChangeMe123!", 12),
    role: "DOCTOR",
    isActive: true
  });

  const response = await request(createApp())
    .post("/api/auth/login")
    .send({ email: " doctor@example.com ", password: "ChangeMe123!" })
    .expect(200);

  assert.equal(response.body.data.user.email, "doctor@example.com");
  assert.equal(response.body.data.user.role, "DOCTOR");
  assert.equal(typeof response.body.data.accessToken, "string");
}
