import bcrypt from "bcryptjs";
import { AppointmentStatus, PaymentMethod, PrescriptionStatus, Role, VisitStatus, Prisma } from "@prisma/client";

export const nowIso = "2026-06-10T09:00:00.000Z";
export const updatedIso = "2026-06-10T10:00:00.000Z";

export const doctorUser = {
  id: "doctor_1",
  email: "doctor@example.com",
  name: "Clinic Doctor",
  role: Role.DOCTOR,
  isActive: true,
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const secretaryUser = {
  id: "secretary_1",
  email: "secretary@example.com",
  name: "Main Secretary",
  role: Role.SECRETARY,
  isActive: true,
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const inactiveSecretaryUser = {
  ...secretaryUser,
  id: "secretary_inactive",
  email: "inactive-secretary@example.com",
  isActive: false
};

export const clinicFixture = {
  id: "clinic_1",
  name: "Main Clinic",
  phone: "+966500000000",
  address: "Riyadh",
  isActive: true,
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const inactiveClinicFixture = {
  ...clinicFixture,
  id: "clinic_inactive",
  name: "Inactive Clinic",
  isActive: false
};

export const patientFixture = {
  id: "patient_1",
  name: "Ahmed Ali",
  phone: "0500000000",
  clinicId: clinicFixture.id,
  notes: "Administrative note",
  isActive: true,
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const inactivePatientFixture = {
  ...patientFixture,
  id: "patient_inactive",
  name: "Inactive Patient",
  isActive: false
};

export const appointmentFixture = {
  id: "appointment_1",
  patientId: patientFixture.id,
  clinicId: clinicFixture.id,
  scheduledAt: new Date("2026-06-11T09:00:00.000Z"),
  status: AppointmentStatus.SCHEDULED,
  notes: "Initial appointment",
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const visitFixture = {
  id: "visit_1",
  patientId: patientFixture.id,
  clinicId: clinicFixture.id,
  doctorId: doctorUser.id,
  visitDate: new Date("2026-06-11T09:00:00.000Z"),
  diagnosis: "Acute bronchitis",
  treatment: "Rest and medication",
  status: VisitStatus.OPEN,
  notes: "Initial visit note",
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const visitRevisionFixture = {
  id: "visit_revision_1",
  visitId: visitFixture.id,
  changedByUserId: doctorUser.id,
  diagnosis: visitFixture.diagnosis,
  treatment: visitFixture.treatment,
  notes: visitFixture.notes,
  reason: "Corrected diagnosis",
  createdAt: new Date(updatedIso)
};

export const prescriptionFixture = {
  id: "prescription_1",
  visitId: visitFixture.id,
  doctorId: doctorUser.id,
  medications: [
    {
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "3 times daily",
      duration: "7 days"
    }
  ],
  instructions: "Take after meals",
  status: PrescriptionStatus.ACTIVE,
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const prescriptionRevisionFixture = {
  id: "prescription_revision_1",
  prescriptionId: prescriptionFixture.id,
  changedByUserId: doctorUser.id,
  medications: prescriptionFixture.medications,
  instructions: prescriptionFixture.instructions,
  reason: "Medication correction",
  createdAt: new Date(updatedIso)
};

export const paymentFixture = {
  id: "payment_1",
  patientId: patientFixture.id,
  visitId: visitFixture.id,
  clinicId: clinicFixture.id,
  receivedByUserId: secretaryUser.id,
  totalAmount: new Prisma.Decimal("300.00"),
  paidAmount: new Prisma.Decimal("200.00"),
  remainingAmount: new Prisma.Decimal("100.00"),
  method: PaymentMethod.CASH,
  paidAt: new Date("2026-06-11T10:00:00.000Z"),
  notes: "Initial payment",
  createdAt: new Date(nowIso),
  updatedAt: new Date(nowIso)
};

export const paymentRevisionFixture = {
  id: "payment_revision_1",
  paymentId: paymentFixture.id,
  changedByUserId: secretaryUser.id,
  totalAmount: paymentFixture.totalAmount,
  paidAmount: paymentFixture.paidAmount,
  remainingAmount: paymentFixture.remainingAmount,
  method: paymentFixture.method,
  reason: "Corrected amount",
  createdAt: new Date(updatedIso)
};

export async function withPasswordHash<T extends typeof doctorUser | typeof secretaryUser>(user: T, password = "ChangeMe123!") {
  return {
    ...user,
    passwordHash: await bcrypt.hash(password, 12)
  };
}
