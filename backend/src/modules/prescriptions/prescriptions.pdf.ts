import type { Prisma } from "@prisma/client";
import { createPdfBuffer } from "../../lib/pdf";

export type PrescriptionPdfData = Prisma.PrescriptionGetPayload<{
  include: {
    visit: {
      include: {
        patient: true;
        clinic: true;
      };
    };
    doctor: true;
  };
}>;

export async function createPrescriptionPdf(prescription: PrescriptionPdfData) {
  return createPdfBuffer((document) => {
    document.fontSize(18).text("Prescription", { align: "center" });
    document.moveDown();

    document.fontSize(12).text(`Prescription ID: ${prescription.id}`);
    document.text(`Patient: ${prescription.visit.patient.name}`);
    document.text(`Clinic: ${prescription.visit.clinic.name}`);
    document.text(`Doctor: ${prescription.doctor.name}`);
    document.text(`Visit Date: ${prescription.visit.visitDate.toISOString()}`);
    document.text(`Prescription Date: ${prescription.createdAt.toISOString()}`);
    document.moveDown();

    document.fontSize(14).text("Medications");
    for (const medication of prescription.medications as Array<Record<string, string>>) {
      document.fontSize(12).text(
        `${medication.name} | ${medication.dosage} | ${medication.frequency} | ${medication.duration}`
      );
    }

    document.moveDown();
    document.fontSize(14).text("Instructions");
    document.fontSize(12).text(prescription.instructions);
  });
}
