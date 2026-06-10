import { AppointmentStatus, type Appointment, type Prisma } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { AppointmentInput, AppointmentListQuery, AppointmentStatusInput } from "./appointments.validation";

function toAppointment(appointment: Appointment) {
  return appointment;
}

async function findAppointmentOrThrow(id: string) {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new AppError(404, "Appointment not found");
  }

  return appointment;
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

function dateRange(date?: string) {
  if (!date) {
    return {};
  }

  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    scheduledAt: {
      gte: start,
      lt: end
    }
  };
}

export class AppointmentsService {
  async list(query: AppointmentListQuery) {
    const pagination = getPagination(query);
    const where: Prisma.AppointmentWhereInput = {
      ...dateRange(query.date),
      ...(query.clinicId ? { clinicId: query.clinicId } : {}),
      ...(query.patientId ? { patientId: query.patientId } : {}),
      ...(query.status ? { status: query.status } : {})
    };

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: { scheduledAt: "asc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.appointment.count({ where })
    ]);

    return toPaginatedData(items.map(toAppointment), pagination, total);
  }

  async create(input: AppointmentInput) {
    await ensureActivePatient(input.patientId);
    await ensureActiveClinic(input.clinicId);

    return toAppointment(
      await prisma.appointment.create({
        data: {
          patientId: input.patientId,
          clinicId: input.clinicId,
          scheduledAt: input.scheduledAt,
          status: input.status ?? AppointmentStatus.SCHEDULED,
          notes: input.notes
        }
      })
    );
  }

  async get(id: string) {
    return toAppointment(await findAppointmentOrThrow(id));
  }

  async update(id: string, input: AppointmentInput) {
    await findAppointmentOrThrow(id);
    await ensureActivePatient(input.patientId);
    await ensureActiveClinic(input.clinicId);

    return toAppointment(
      await prisma.appointment.update({
        where: { id },
        data: {
          patientId: input.patientId,
          clinicId: input.clinicId,
          scheduledAt: input.scheduledAt,
          status: input.status,
          notes: input.notes
        }
      })
    );
  }

  async changeStatus(id: string, input: AppointmentStatusInput) {
    await findAppointmentOrThrow(id);
    return toAppointment(await prisma.appointment.update({ where: { id }, data: { status: input.status } }));
  }
}

export const appointmentsService = new AppointmentsService();
