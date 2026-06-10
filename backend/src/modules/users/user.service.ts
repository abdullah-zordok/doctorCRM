import type { Role, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

export function toSafeUser(user: Pick<User, "id" | "email" | "name" | "role" | "isActive">): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive
  };
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() }
  });
}

export async function findActiveUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.isActive) {
    return null;
  }

  return user;
}

export async function countActiveDoctorsByEmail(email: string) {
  return prisma.user.count({
    where: {
      email: email.trim().toLowerCase(),
      role: "DOCTOR",
      isActive: true
    }
  });
}
