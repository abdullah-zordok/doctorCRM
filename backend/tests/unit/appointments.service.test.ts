import assert from "node:assert/strict";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { AppointmentsService } from "../../src/modules/appointments/appointments.service";
import { appointmentFixture, clinicFixture, inactiveClinicFixture, inactivePatientFixture, patientFixture } from "../helpers/admin-fixtures";

export async function run() {
  const service = new AppointmentsService();
  let updatePayload: any = null;

  (prisma.appointment as any).findUnique = async () => appointmentFixture;
  (prisma.appointment as any).create = async ({ data }: any) => ({ ...appointmentFixture, ...data });
  (prisma.appointment as any).update = async (payload: any) => {
    updatePayload = payload;
    return { ...appointmentFixture, ...payload.data };
  };

  (prisma.patient as any).findUnique = async () => inactivePatientFixture;
  (prisma.clinic as any).findUnique = async () => clinicFixture;
  await assert.rejects(
    () => service.create({ patientId: inactivePatientFixture.id, clinicId: clinicFixture.id, scheduledAt: new Date() }),
    AppError
  );

  (prisma.patient as any).findUnique = async () => patientFixture;
  (prisma.clinic as any).findUnique = async () => inactiveClinicFixture;
  await assert.rejects(
    () => service.create({ patientId: patientFixture.id, clinicId: inactiveClinicFixture.id, scheduledAt: new Date() }),
    AppError
  );

  (prisma.clinic as any).findUnique = async () => clinicFixture;
  const created = await service.create({ patientId: patientFixture.id, clinicId: clinicFixture.id, scheduledAt: new Date() });
  assert.equal(created.status, AppointmentStatus.SCHEDULED);

  await service.changeStatus(appointmentFixture.id, { status: AppointmentStatus.CANCELLED });
  assert.deepEqual(updatePayload.data, { status: AppointmentStatus.CANCELLED });
}
