import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { env } from "../config/env";

process.env.DATABASE_URL = env.DATABASE_URL;

function createPrismaClient(): PrismaClient {
  const tursoUrl =
    env.TURSO_DATABASE_URL ||
    (env.DATABASE_URL.startsWith("libsql://") || env.DATABASE_URL.startsWith("https://")
      ? env.DATABASE_URL
      : undefined);

  if (tursoUrl) {
    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: env.TURSO_AUTH_TOKEN
    });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = createPrismaClient();

