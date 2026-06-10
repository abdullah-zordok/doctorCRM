import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { appointmentsRouter } from "./modules/appointments/appointments.routes";
import { clinicsRouter } from "./modules/clinics/clinics.routes";
import { dashboardRouter } from "./modules/dashboards/dashboards.routes";
import { healthRouter } from "./modules/health/health.routes";
import { patientsRouter } from "./modules/patients/patients.routes";
import { paymentsRouter } from "./modules/payments/payments.routes";
import { prescriptionsRouter } from "./modules/prescriptions/prescriptions.routes";
import { secretariesRouter } from "./modules/secretaries/secretaries.routes";
import { visitsRouter } from "./modules/visits/visits.routes";

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
  app.use("/api/patients/:patientId/visits", visitsRouter);
  app.use("/api/visits/:visitId/prescriptions", prescriptionsRouter);
  app.use("/api/visits", visitsRouter);
  app.use("/api/prescriptions", prescriptionsRouter);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/dashboard", dashboardRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
