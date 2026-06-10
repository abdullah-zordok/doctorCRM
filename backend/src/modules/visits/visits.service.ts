import { Prisma, type Visit } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import { VisitStatus } from "@prisma/client";
import type { VisitInput, VisitListQuery, VisitUpdateInput } from "./visits.validation";

function toVisit(visit: Visit) {
  return visit;
}

function buildDateRangeFilter(from?: string, to?: string) {
  if (!from && !to) {
    return undefined;
  }

  const filter: Prisma.DateTimeFilter = {};

  if (from) {
    filter.gte = new Date(from);
  }

  if (to) {
    const end = new Date(to);
    end.setUTCDate(end.getUTCDate() + 1);
    filter.lt = end;
  }

  return filter;
}

async function findVisitOrThrow(id: string) {
  const visit = await prisma.visit.findUnique({ where: { id } });
  if (!visit) {
    throw new AppError(404, "Visit not found");
  }

  return visit;
}

async function ensureActivePatient(patientId: string) {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient || !patient.isActive) {
    throw new AppError(400, "Active patient is required");
  }
}

async function ensureActiveClinic(clinicId: string) {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic || !clinic.isActive) {
    throw new AppError(400, "Active clinic is required");
  }
}

export class VisitsService {
  async list(query: VisitListQuery) {
    const pagination = getPagination(query);
    const where: Prisma.VisitWhereInput = {
      ...(query.patientId ? { patientId: query.patientId } : {}),
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(query.doctorId ? { doctorId: query.doctorId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(buildDateRangeFilter(query.from, query.to) ? { visitDate: buildDateRangeFilter(query.from, query.to) } : {})
    };

    const [items, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        orderBy: { visitDate: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.visit.count({ where })
    ]);

    return toPaginatedData(items.map(toVisit), pagination, total);
  }

  async create(patientId: string, input: VisitInput, doctorId: string) {
    const resolvedPatientId = input.patientId ?? patientId;
    if (!resolvedPatientId) {
      throw new AppError(400, "Patient is required");
    }

    await ensureActivePatient(resolvedPatientId);
    await ensureActiveClinic(input.clinicId);

    return toVisit(
      await prisma.visit.create({
        data: {
          patientId: resolvedPatientId,
          clinicId: input.clinicId,
          doctorId,
          visitDate: input.visitDate,
          diagnosis: input.diagnosis,
          treatment: input.treatment,
          notes: input.notes,
          status: input.status ?? VisitStatus.OPEN
        }
      })
    );
  }

  async get(id: string) {
    return toVisit(await findVisitOrThrow(id));
  }

  async update(id: string, input: VisitUpdateInput, changedByUserId: string) {
    const current = await findVisitOrThrow(id);
    await ensureActivePatient(current.patientId);
    await ensureActiveClinic(current.clinicId);

    await prisma.visitRevision.create({
      data: {
        visitId: id,
        changedByUserId,
        diagnosis: current.diagnosis,
        treatment: current.treatment,
        notes: current.notes,
        reason: input.reason
      }
    });

    return toVisit(
      await prisma.visit.update({
        where: { id },
        data: {
          diagnosis: input.diagnosis ?? current.diagnosis,
          treatment: input.treatment ?? current.treatment,
          notes: input.notes ?? current.notes
        }
      })
    );
  }
}

export const visitsService = new VisitsService();
