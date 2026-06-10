import jwt from "jsonwebtoken";
import { env } from "../../src/config/env";
import { prisma } from "../../src/lib/prisma";
import { doctorUser, secretaryUser } from "./admin-fixtures";

type AuthUserFixture = typeof doctorUser | typeof secretaryUser;

export function signToken(user: AuthUserFixture) {
  return jwt.sign(
    {
      role: user.role
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    }
  );
}

export const doctorToken = signToken(doctorUser);
export const secretaryToken = signToken(secretaryUser);

export function mockAuthenticatedUsers(users: AuthUserFixture[] = [doctorUser, secretaryUser]) {
  (prisma.user as any).findUnique = async ({ where }: { where: { id?: string; email?: string } }) =>
    users.find((user) => user.id === where.id || user.email === where.email) ?? null;
}
