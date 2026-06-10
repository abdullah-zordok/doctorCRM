import bcrypt from "bcryptjs";
import type { Prisma, User } from "@prisma/client";
import { Role } from "@prisma/client";
import { AppError } from "../../lib/responses";
import { getPagination, toPaginatedData } from "../../lib/pagination";
import { prisma } from "../../lib/prisma";
import type { CreateSecretaryInput, SecretaryListQuery, SecretaryStatusInput, UpdateSecretaryInput } from "./secretaries.validation";

function toSecretary(user: Pick<User, "id" | "email" | "name" | "role" | "isActive" | "createdAt" | "updatedAt">) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function findSecretaryOrThrow(id: string) {
  const secretary = await prisma.user.findFirst({
    where: {
      id,
      role: Role.SECRETARY
    }
  });

  if (!secretary) {
    throw new AppError(404, "Secretary not found");
  }

  return secretary;
}

export class SecretariesService {
  async list(query: SecretaryListQuery) {
    const pagination = getPagination(query);
    const where: Prisma.UserWhereInput = {
      role: Role.SECRETARY,
      ...(query.isActive === undefined ? {} : { isActive: query.isActive })
    };

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: pagination.skip,
        take: pagination.take
      }),
      prisma.user.count({ where })
    ]);

    return toPaginatedData(items.map(toSecretary), pagination, total);
  }

  async create(input: CreateSecretaryInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError(409, "Email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const secretary = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: Role.SECRETARY,
        isActive: true
      }
    });

    return toSecretary(secretary);
  }

  async get(id: string) {
    return toSecretary(await findSecretaryOrThrow(id));
  }

  async update(id: string, input: UpdateSecretaryInput) {
    await findSecretaryOrThrow(id);

    if (input.email) {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing && existing.id !== id) {
        throw new AppError(409, "Email already exists");
      }
    }

    const data: Prisma.UserUpdateInput = {
      ...(input.email ? { email: input.email } : {}),
      ...(input.name ? { name: input.name } : {})
    };

    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, 12);
    }

    const secretary = await prisma.user.update({
      where: { id },
      data
    });

    return toSecretary(secretary);
  }

  async changeStatus(id: string, input: SecretaryStatusInput) {
    await findSecretaryOrThrow(id);
    const secretary = await prisma.user.update({
      where: { id },
      data: { isActive: input.isActive }
    });

    return toSecretary(secretary);
  }
}

export const secretariesService = new SecretariesService();
