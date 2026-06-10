import rateLimit from "express-rate-limit";
import { sendError } from "../lib/responses";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => sendError(res, 429, "Too many requests", [])
});
