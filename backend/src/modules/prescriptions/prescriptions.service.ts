import { PrescriptionStatus, Prisma, type Prescription } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { prisma } from "../../lib/prisma";
import { createPrescriptionPdf } from "./prescriptions.pdf";
import type { PrescriptionInput, PrescriptionUpdateInput } from "./prescriptions.validation";

function toPrescription(prescription: Prescription) {
  return prescription;
}

async function findPrescriptionOrThrow(id: string) {
  const prescription = await prisma.prescription.findUnique({ where: { id } });
  if (!prescription) {
    throw new AppError(404, "Prescription not found");
  }

  return prescription;
}

async function findPrescriptionWithRelationsOrThrow(id: string) {
  const prescription = await prisma.prescription.findUnique({
    where: { id },
    include: {
      visit: {
        include: {
          patient: true,
          clinic: true
        }
      },
      doctor: true
    }
  });

  if (!prescription) {
    throw new AppError(404, "Prescription not found");
  }

  return prescription;
}

async function findVisitOrThrow(visitId: string) {
  const visit = await prisma.visit.findUnique({ where: { id: visitId } });
  if (!visit) {
    throw new AppError(404, "Visit not found");
  }

  return visit;
}

export class PrescriptionsService {
  async create(visitId: string, input: PrescriptionInput, doctorId: string) {
    const resolvedVisitId = input.visitId ?? visitId;
    if (!resolvedVisitId) {
      throw new AppError(400, "Visit is required");
    }

    await findVisitOrThrow(resolvedVisitId);

    return toPrescription(
      await prisma.prescription.create({
        data: {
          visitId: resolvedVisitId,
          doctorId,
          medications: input.medications,
          instructions: input.instructions,
          status: input.status ?? PrescriptionStatus.ACTIVE
        }
      })
    );
  }

  async get(id: string) {
    return toPrescription(await findPrescriptionOrThrow(id));
  }

  async update(id: string, input: PrescriptionUpdateInput, changedByUserId: string) {
    const current = await findPrescriptionOrThrow(id);

    await prisma.prescriptionRevision.create({
      data: {
        prescriptionId: id,
        changedByUserId,
        medications: current.medications as Prisma.InputJsonValue,
        instructions: current.instructions,
        reason: input.reason
      }
    });

    return toPrescription(
      await prisma.prescription.update({
        where: { id },
        data: {
          medications: input.medications ?? (current.medications as Prisma.InputJsonValue),
          instructions: input.instructions ?? current.instructions
        }
      })
    );
  }

  async createPdf(id: string) {
    const prescription = await findPrescriptionWithRelationsOrThrow(id);
    return createPrescriptionPdf(prescription);
  }
}

export const prescriptionsService = new PrescriptionsService();
