/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import type { Role } from "@/types/api";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen p-5 sm:p-8">
      <div className="mx-auto max-w-[1540px] rounded-3xl border bg-card/80 p-6 shadow-soft">
        <PageSkeleton />
      </div>
    </div>
  );
}

export function roleHomePath(role: Role) {
  return role === "DOCTOR" ? "/doctor" : "/secretary";
}

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const location = useLocation();
  const { user, status } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}

export function RootRedirect() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  return <Navigate to={user ? roleHomePath(user.role) : "/login"} replace />;
}
