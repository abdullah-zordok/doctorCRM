import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { PatientsService } from "../../src/modules/patients/patients.service";
import { clinicFixture, inactiveClinicFixture, patientFixture } from "../helpers/admin-fixtures";

export async function run() {
  const service = new PatientsService();
  let updatePayload: any = null;

  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.patient as any).create = async ({ data }: any) => ({ ...patientFixture, ...data });
  (prisma.patient as any).update = async (payload: any) => {
    updatePayload = payload;
    return { ...patientFixture, ...payload.data };
  };

  (prisma.clinic as any).findUnique = async () => inactiveClinicFixture;
  await assert.rejects(
    () => service.create({ name: "Ahmed", phone: "0500000000", clinicId: inactiveClinicFixture.id }),
    AppError
  );

  (prisma.clinic as any).findUnique = async () => clinicFixture;
  const created = await service.create({ name: "Ahmed", phone: "0500000000", clinicId: clinicFixture.id });
  assert.equal(created.phone, "0500000000");

  await service.changeStatus(patientFixture.id, { isActive: false });
  assert.deepEqual(updatePayload.data, { isActive: false });
}
