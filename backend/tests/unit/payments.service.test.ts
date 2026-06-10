import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";
import { AppError } from "../../src/lib/responses";
import { PaymentsService } from "../../src/modules/payments/payments.service";
import {
  clinicFixture,
  doctorUser,
  paymentFixture,
  paymentRevisionFixture,
  patientFixture,
  secretaryUser,
  visitFixture
} from "../helpers/admin-fixtures";
import { resetPrismaMocks } from "../helpers/prisma-mock";

export async function run() {
  resetPrismaMocks();
  const service = new PaymentsService();
  let revisionPayload: any = null;

  (prisma.patient as any).findUnique = async ({ where }: any) => (where.id === patientFixture.id ? patientFixture : null);
  (prisma.clinic as any).findUnique = async ({ where }: any) => (where.id === clinicFixture.id ? clinicFixture : null);
  (prisma.visit as any).findUnique = async ({ where }: any) => (where.id === visitFixture.id ? visitFixture : null);
  (prisma.payment as any).findUnique = async ({ where }: any) => (where.id === paymentFixture.id ? paymentFixture : null);
  (prisma.payment as any).create = async ({ data }: any) => ({ ...paymentFixture, ...data });
  (prisma.payment as any).update = async ({ data }: any) => ({ ...paymentFixture, ...data });
  (prisma.paymentRevision as any).create = async (payload: any) => {
    revisionPayload = payload;
    return { ...paymentRevisionFixture, ...payload.data };
  };

  const created = await service.create(
    {
      patientId: patientFixture.id,
      clinicId: clinicFixture.id,
      visitId: visitFixture.id,
      totalAmount: "300.00",
      paidAmount: "200.00",
      method: "CASH"
    } as any,
    secretaryUser.id
  );
  assert.equal(created.remainingAmount, "100.00");

  await assert.rejects(
    () =>
      service.create(
        {
          patientId: patientFixture.id,
          clinicId: clinicFixture.id,
          totalAmount: "100.00",
          paidAmount: "150.00",
          method: "CASH"
        } as any,
        secretaryUser.id
      ),
    AppError
  );

  const updated = await service.update(paymentFixture.id, { paidAmount: "150.00", reason: "Corrected amount" }, doctorUser.id);
  assert.equal(updated.remainingAmount, "150.00");
  assert.equal(revisionPayload.data.reason, "Corrected amount");
}
