import type { Patient, Prisma } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { PatientInput, PatientListQuery, PatientStatusInput } from "./patients.validation";

function toPatient(patient: Patient) {
  return patient;
}

async function findPatientOrThrow(id: string) {
  const patient = await prisma.patient.findUnique({ where: { id } });
  if (!patient) {
    throw new AppError(404, "Patient not found");
  }

  return patient;
}

async function ensureActiveClinic(clinicId: string) {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic || !clinic.isActive) {
    throw new AppError(400, "Active clinic is required");
  }
}

export class PatientsService {
  async list(query: PatientListQuery) {
    const pagination = getPagination(query);
    const where: Prisma.PatientWhereInput = {
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(query.isActive === undefined ? {} : { isActive: query.isActive }),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.patient.count({ where })
    ]);

    return toPaginatedData(items.map(toPatient), pagination, total);
  }

  async create(input: PatientInput) {
    await ensureActiveClinic(input.clinicId);
    return toPatient(await prisma.patient.create({ data: input }));
  }

  async get(id: string) {
    return toPatient(await findPatientOrThrow(id));
  }

  async update(id: string, input: PatientInput) {
    await findPatientOrThrow(id);
    await ensureActiveClinic(input.clinicId);
    return toPatient(await prisma.patient.update({ where: { id }, data: input }));
  }

  async changeStatus(id: string, input: PatientStatusInput) {
    await findPatientOrThrow(id);
    return toPatient(await prisma.patient.update({ where: { id }, data: { isActive: input.isActive } }));
  }
}

export const patientsService = new PatientsService();
