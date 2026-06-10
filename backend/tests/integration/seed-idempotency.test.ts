import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { seedDoctor } from "../../prisma/seed";

export async function run() {
  const calls: unknown[] = [];
  (prisma.user as any).upsert = async (payload: unknown) => {
    calls.push(payload);
    return {};
  };

  await seedDoctor();
  await seedDoctor();
  await seedDoctor();

  assert.equal(calls.length, 3);
  assert.deepEqual((calls[0] as any).where, { email: "doctor@example.com" });
  assert.deepEqual((calls[0] as any).update.role, "DOCTOR");
  assert.deepEqual((calls[0] as any).create.role, "DOCTOR");
}
