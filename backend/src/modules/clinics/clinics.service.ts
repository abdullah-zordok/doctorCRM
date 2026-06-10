import type { Clinic, Prisma, Role } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { ClinicInput, ClinicListQuery, ClinicStatusInput } from "./clinics.validation";

function toClinic(clinic: Clinic) {
  return clinic;
}

async function findClinicOrThrow(id: string, role?: Role) {
  const clinic = await prisma.clinic.findUnique({ where: { id } });
  if (!clinic || (role === "SECRETARY" && !clinic.isActive)) {
    throw new AppError(404, "Clinic not found");
  }

  return clinic;
}

export class ClinicsService {
  async list(query: ClinicListQuery, role?: Role) {
    const pagination = getPagination(query);
    const where: Prisma.ClinicWhereInput =
      role === "SECRETARY"
        ? { isActive: true }
        : {
            ...(query.isActive === undefined ? {} : { isActive: query.isActive })
          };

    const [items, total] = await Promise.all([
      prisma.clinic.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.clinic.count({ where })
    ]);

    return toPaginatedData(items.map(toClinic), pagination, total);
  }

  async create(input: ClinicInput) {
    return toClinic(await prisma.clinic.create({ data: input }));
  }

  async get(id: string, role?: Role) {
    return toClinic(await findClinicOrThrow(id, role));
  }

  async update(id: string, input: ClinicInput) {
    await findClinicOrThrow(id);
    return toClinic(await prisma.clinic.update({ where: { id }, data: input }));
  }

  async changeStatus(id: string, input: ClinicStatusInput) {
    await findClinicOrThrow(id);
    return toClinic(await prisma.clinic.update({ where: { id }, data: { isActive: input.isActive } }));
  }
}

export const clinicsService = new ClinicsService();
