import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://doctor_user:doctor_password@postgres:5432/doctor_db"),
  JWT_SECRET: z.string().min(16).default("change_me_in_production"),
  JWT_EXPIRES_IN: z.string().min(1).default("7d")
});

export const env = envSchema.parse(process.env);
