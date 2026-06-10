import assert from "node:assert/strict";
import { createPrescriptionPdf, type PrescriptionPdfData } from "../../src/modules/prescriptions/prescriptions.pdf";
import {
  clinicFixture,
  doctorUser,
  patientFixture,
  prescriptionFixture,
  visitFixture
} from "../helpers/admin-fixtures";

function extractPdfText(buffer: Buffer) {
  const raw = buffer.toString("latin1");
  return Array.from(raw.matchAll(/<([0-9a-fA-F]+)>/g))
    .map((match) => Buffer.from(match[1], "hex").toString("utf8"))
    .join("");
}

export async function run() {
  const buffer = await createPrescriptionPdf({
    ...prescriptionFixture,
    visit: {
      ...visitFixture,
      patient: patientFixture,
      clinic: clinicFixture
    },
    doctor: {
      ...doctorUser,
      passwordHash: "hashed"
    }
  } as unknown as PrescriptionPdfData);

  const pdfText = extractPdfText(buffer);
  assert.ok(buffer.length > 0);
  assert.match(pdfText, /Prescription/);
  assert.match(pdfText, /Ahmed Ali/);
  assert.match(pdfText, /Amoxicillin/);
}
