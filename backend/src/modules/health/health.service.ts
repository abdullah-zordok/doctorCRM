import { prisma } from "../../lib/prisma";

export async function getReadiness() {
  await prisma.$queryRaw`SELECT 1`;
  return {};
}
