import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/config/env";
import { createApp } from "../../src/app";

function tokenFor(id = "user_1") {
  return jwt.sign({ role: "DOCTOR" }, env.JWT_SECRET, {
    subject: id,
    expiresIn: "7d"
  });
}

export async function run() {
  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    role: "DOCTOR",
    isActive: true
  });

  const meResponse = await request(createApp())
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${tokenFor()}`)
    .expect(200);

  assert.deepEqual(meResponse.body.data, {
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    role: "DOCTOR",
    isActive: true
  });

  const unauthorizedMeResponse = await request(createApp()).get("/api/auth/me").expect(401);
  assert.equal(unauthorizedMeResponse.body.success, false);

  const logoutResponse = await request(createApp())
    .post("/api/auth/logout")
    .set("Authorization", `Bearer ${tokenFor()}`)
    .expect(200);

  assert.deepEqual(logoutResponse.body, {
    success: true,
    message: "Logout successful",
    data: {}
  });

  const unauthorizedLogoutResponse = await request(createApp()).post("/api/auth/logout").expect(401);
  assert.equal(unauthorizedLogoutResponse.body.success, false);
}
