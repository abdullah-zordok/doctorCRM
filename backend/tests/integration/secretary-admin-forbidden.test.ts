import request from "supertest";
import { createApp } from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { secretaryToken } from "../helpers/auth-fixtures";
import { secretaryUser } from "../helpers/admin-fixtures";

export async function run() {
  (prisma.user as any).findUnique = async () => secretaryUser;

  await request(createApp())
    .post("/api/users/secretaries")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ email: "doctor2@example.com", name: "Doctor Escalation", password: "StrongPass123", role: "DOCTOR" })
    .expect(403);

  await request(createApp())
    .post("/api/clinics")
    .set("Authorization", `Bearer ${secretaryToken}`)
    .send({ name: "Blocked Clinic" })
    .expect(403);
}
