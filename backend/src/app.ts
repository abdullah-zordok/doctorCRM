import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { appointmentsRouter } from "./modules/appointments/appointments.routes";
import { clinicsRouter } from "./modules/clinics/clinics.routes";
import { healthRouter } from "./modules/health/health.routes";
import { patientsRouter } from "./modules/patients/patients.routes";
import { secretariesRouter } from "./modules/secretaries/secretaries.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users/secretaries", secretariesRouter);
  app.use("/api/clinics", clinicsRouter);
  app.use("/api/patients", patientsRouter);
  app.use("/api/appointments", appointmentsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
