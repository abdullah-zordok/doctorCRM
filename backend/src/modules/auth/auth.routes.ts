import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middleware/auth.middleware";
import { authRateLimiter } from "../../middleware/rate-limit.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { login, logout, me } from "./auth.controller";
import { loginSchema } from "./auth.validation";

export const authRouter = Router();

authRouter.post(
  "/login",
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  asyncHandler(login)
);

authRouter.get("/me", authenticate, asyncHandler(me));
authRouter.post("/logout", authenticate, asyncHandler(logout));
