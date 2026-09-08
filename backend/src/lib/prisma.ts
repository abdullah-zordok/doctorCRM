import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { env } from "../config/env";

function setupDatabaseUrl(): string {
  const tursoUrl =
    env.TURSO_DATABASE_URL ||
    (env.DATABASE_URL.startsWith("libsql://") || env.DATABASE_URL.startsWith("https://")
      ? env.DATABASE_URL
      : undefined);

  if (tursoUrl) {
    return env.DATABASE_URL;
  }

  // On Vercel Serverless environment, copy SQLite file to writable /tmp
  if (process.env.VERCEL) {
    const dest = "/tmp/dev.db";
    if (!fs.existsSync(dest)) {
      const candidates = [
        path.join(process.cwd(), "prisma/dev.db"),
        path.join(process.cwd(), "backend/prisma/dev.db"),
        path.join(__dirname, "../../../prisma/dev.db"),
        path.join(__dirname, "../../prisma/dev.db")
      ];
      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          try {
            fs.copyFileSync(candidate, dest);
            break;
          } catch {
            // Ignore copy failure and fallback
          }
        }
      }
    }
    return "file:/tmp/dev.db";
  }

  return env.DATABASE_URL;
}

process.env.DATABASE_URL = setupDatabaseUrl();

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

