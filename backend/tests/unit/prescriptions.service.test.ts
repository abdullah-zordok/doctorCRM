import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { PrescriptionsService } from "../../src/modules/prescriptions/prescriptions.service";
import {
  doctorUser,
  prescriptionFixture,
  prescriptionRevisionFixture,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  const service = new PrescriptionsService();
  let revisionPayload: any = null;

  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.prescription as any).findUnique = async ({ where }: any) =>
    where.id === prescriptionFixture.id ? prescriptionFixture : null;
  (prisma.prescription as any).create = async ({ data }: any) => ({ ...prescriptionFixture, ...data });
  (prisma.prescription as any).update = async ({ data }: any) => ({ ...prescriptionFixture, ...data });
  (prisma.prescriptionRevision as any).create = async (payload: any) => {
    revisionPayload = payload;
    return { ...prescriptionRevisionFixture, ...payload.data };
  };

  await assert.rejects(
    () =>
      service.create("", {
        medications: prescriptionFixture.medications as any,
        instructions: "Take after meals"
      }, doctorUser.id),
    AppError
  );

  const created = await service.create(visitFixture.id, {
    medications: prescriptionFixture.medications as any,
    instructions: "Take after meals"
  }, doctorUser.id);
  assert.equal(created.instructions, "Take after meals");

  const updated = await service.update(prescriptionFixture.id, {
    instructions: "Take before meals",
    reason: "Instruction correction"
  }, doctorUser.id);
  assert.equal(updated.instructions, "Take before meals");
  assert.equal(revisionPayload.data.reason, "Instruction correction");
}
