import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import request from "supertest";
import { prisma } from "../../src/lib/prisma";
import { env } from "../../src/config/env";
import { createApp } from "../../src/app";

function signToken(overrides: Record<string, unknown> = {}, expiresIn = "7d") {
  return jwt.sign({ role: "DOCTOR", ...overrides }, env.JWT_SECRET, {
    subject: "user_1",
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"]
  }) as string;
}

export async function run() {
  await request(createApp()).get("/api/auth/me").expect(401);
  await request(createApp()).get("/api/auth/me").set("Authorization", "Bearer bad").expect(401);
  await request(createApp())
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${signToken({}, "-1s")}`)
    .expect(401);

  const tamperedToken = signToken().replace(/.$/, "x");
  await request(createApp()).get("/api/auth/me").set("Authorization", `Bearer ${tamperedToken}`).expect(401);

  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    role: "DOCTOR",
    isActive: false
  });

  await request(createApp())
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${signToken()}`)
    .expect(401);

  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    role: "DOCTOR",
    isActive: true
  });

  const validResponse = await request(createApp())
    .get("/api/auth/me")
    .set("Authorization", `Bearer ${signToken()}`)
    .expect(200);

  assert.equal(validResponse.body.success, true);
}
