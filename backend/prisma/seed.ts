import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

export async function seedDoctor() {
  const email = (process.env.SEED_DOCTOR_EMAIL || "doctor@example.com").trim().toLowerCase();
  const password = process.env.SEED_DOCTOR_PASSWORD || "ChangeMe123!";
  const name = (process.env.SEED_DOCTOR_NAME || "Clinic Doctor").trim();

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      role: Role.DOCTOR,
      isActive: true
    },
    create: {
      email,
      name,
      passwordHash,
      role: Role.DOCTOR,
      isActive: true
    }
  });
}

if (require.main === module) {
  seedDoctor()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exit(1);
    });
}
