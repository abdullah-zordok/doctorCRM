import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { VisitsService } from "../../src/modules/visits/visits.service";
import {
  clinicFixture,
  doctorUser,
  inactiveClinicFixture,
  inactivePatientFixture,
  patientFixture,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  const service = new VisitsService();
  let revisionPayload: any = null;

  (prisma.patient as any).findUnique = async ({ where }: any) => {
    if (where.id === patientFixture.id) return patientFixture;
    if (where.id === inactivePatientFixture.id) return inactivePatientFixture;
    return null;
  };
  (prisma.clinic as any).findUnique = async ({ where }: any) => {
    if (where.id === clinicFixture.id) return clinicFixture;
    if (where.id === inactiveClinicFixture.id) return inactiveClinicFixture;
    return null;
  };
  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.visit as any).create = async ({ data }: any) => ({ ...visitFixture, ...data });
  (prisma.visit as any).update = async ({ data }: any) => ({ ...visitFixture, ...data });
  (prisma.visitRevision as any).create = async (payload: any) => {
    revisionPayload = payload;
    return payload.data;
  };

  await assert.rejects(
    () =>
      service.create(inactivePatientFixture.id, {
        clinicId: clinicFixture.id,
        visitDate: new Date("2026-06-11T09:00:00.000Z"),
        diagnosis: "Diagnosis",
        treatment: "Treatment"
      }, doctorUser.id),
    AppError
  );

  const created = await service.create(patientFixture.id, {
    clinicId: clinicFixture.id,
    visitDate: new Date("2026-06-11T09:00:00.000Z"),
    diagnosis: "Diagnosis",
    treatment: "Treatment",
    notes: "Notes"
  }, doctorUser.id);
  assert.equal(created.diagnosis, "Diagnosis");

  const updated = await service.update(visitFixture.id, { diagnosis: "Updated", reason: "Fix" }, doctorUser.id);
  assert.equal(updated.diagnosis, "Updated");
  assert.equal(revisionPayload.data.reason, "Fix");
}
