import type { Role } from "@prisma/client";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
