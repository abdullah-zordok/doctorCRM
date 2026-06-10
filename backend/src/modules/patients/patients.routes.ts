import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { changePatientStatus, createPatient, getPatient, listPatients, updatePatient } from "./patients.controller";
import { patientInputSchema, patientListQuerySchema, patientParamsSchema, patientStatusSchema } from "./patients.validation";

export const patientsRouter = Router();

patientsRouter.use(authenticate, requireRole(Role.DOCTOR, Role.SECRETARY));

patientsRouter.get("/", validateRequest({ query: patientListQuerySchema }), asyncHandler(listPatients));
patientsRouter.post("/", validateRequest({ body: patientInputSchema }), asyncHandler(createPatient));
patientsRouter.get("/:id", validateRequest({ params: patientParamsSchema }), asyncHandler(getPatient));
patientsRouter.patch("/:id", validateRequest({ params: patientParamsSchema, body: patientInputSchema }), asyncHandler(updatePatient));
patientsRouter.patch("/:id/status", validateRequest({ params: patientParamsSchema, body: patientStatusSchema }), asyncHandler(changePatientStatus));
