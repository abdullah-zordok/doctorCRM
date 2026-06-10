import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../lib/responses";
import type { AuthenticatedUser } from "../../types/express";
import { findUserByEmail, toSafeUser } from "../users/user.service";
import type { LoginInput } from "./auth.validation";

type JwtPayload = {
  sub: string;
  role: string;
};

export class AuthService {
  async login(input: LoginInput) {
    const user = await findUserByEmail(input.email);
    if (!user || !user.isActive) {
      throw new AppError(401, "Invalid credentials");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError(401, "Invalid credentials");
    }

    const safeUser = toSafeUser(user);
    const accessToken = jwt.sign(
      {
        role: safeUser.role
      },
      env.JWT_SECRET,
      {
        subject: safeUser.id,
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
      }
    );

    return {
      accessToken,
      user: safeUser
    };
  }

  currentUser(user: AuthenticatedUser) {
    return user;
  }

  logout() {
    return {};
  }

  verifyToken(token: string): JwtPayload {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string" || !payload.sub) {
      throw new AppError(401, "Unauthorized");
    }

    return {
      sub: payload.sub,
      role: String(payload.role)
    };
  }
}

export const authService = new AuthService();
