/* eslint-disable react-refresh/only-export-components */
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import type { Role } from "@/types/api";

export function roleHomePath(role: Role) {
  return role === "DOCTOR" ? "/doctor" : "/secretary";
}

export function ProtectedRoute({ allowedRoles }: { allowedRoles?: Role[] }) {
  const location = useLocation();
  const { user, status } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background p-6">
        <PageSkeleton />
      </div>
    );
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
    return (
      <div className="min-h-screen bg-background p-6">
        <PageSkeleton />
      </div>
    );
  }

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return <Outlet />;
}

export function RootRedirect() {
  const { user, status } = useAuth();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background p-6">
        <PageSkeleton />
      </div>
    );
  }

  return <Navigate to={user ? roleHomePath(user.role) : "/login"} replace />;
}
