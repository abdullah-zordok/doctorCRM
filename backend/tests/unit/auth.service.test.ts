import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { AuthService } from "../../src/modules/auth/auth.service";

const service = new AuthService();

export async function run() {
  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    passwordHash: await bcrypt.hash("ChangeMe123!", 12),
    role: "DOCTOR",
    isActive: true
  });

  const result = await service.login({
    email: "doctor@example.com",
    password: "ChangeMe123!"
  });

  assert.equal(typeof result.accessToken, "string");
  assert.deepEqual(result.user, {
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
    passwordHash: await bcrypt.hash("ChangeMe123!", 12),
    role: "DOCTOR",
    isActive: false
  });

  await assert.rejects(
    () => service.login({ email: "doctor@example.com", password: "ChangeMe123!" }),
    AppError
  );

  (prisma.user as any).findUnique = async () => ({
    id: "user_1",
    email: "doctor@example.com",
    name: "Clinic Doctor",
    passwordHash: await bcrypt.hash("OtherPass123!", 12),
    role: "DOCTOR",
    isActive: true
  });

  await assert.rejects(
    () => service.login({ email: "doctor@example.com", password: "ChangeMe123!" }),
    AppError
  );
}
