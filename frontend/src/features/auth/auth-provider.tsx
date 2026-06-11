/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, type LoginPayload } from "@/lib/api-client";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/lib/storage";
import type { AuthUser } from "@/types/api";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [status, setStatus] = React.useState<AuthStatus>("loading");

  React.useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const token = getStoredToken();
      if (!token) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const currentUser = await api.me();
        if (!cancelled) {
          setUser(currentUser);
          setStatus("authenticated");
        }
      } catch {
        if (!cancelled) {
          clearStoredToken();
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = React.useCallback(async (payload: LoginPayload) => {
    const result = await api.login(payload);
    setStoredToken(result.accessToken);
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await api.logout();
    } catch {
      // A local logout should still succeed if the session already expired.
    } finally {
      clearStoredToken();
      setUser(null);
      setStatus("unauthenticated");
      queryClient.clear();
    }
  }, [queryClient]);

  const value = React.useMemo(
    () => ({
      user,
      status,
      login,
      logout
    }),
    [login, logout, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
