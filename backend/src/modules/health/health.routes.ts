import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { health } from "./health.controller";

export const healthRouter = Router();

healthRouter.get("/", asyncHandler(health));
