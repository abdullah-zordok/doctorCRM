import { prisma } from "../../src/lib/prisma";

export function resetPrismaMocks() {
  const delegates = ["user", "clinic", "patient", "appointment"] as const;

  for (const delegate of delegates) {
    for (const method of ["findUnique", "findFirst", "findMany", "create", "update", "count"] as const) {
      if ((prisma as any)[delegate]) {
        (prisma as any)[delegate][method] = undefined;
      }
    }
  }
}
