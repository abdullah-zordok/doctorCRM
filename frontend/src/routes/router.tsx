/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/skeleton";
import { PublicOnlyRoute, ProtectedRoute, RootRedirect } from "@/features/auth/auth-routes";
import { LoginPage } from "@/features/auth/login-page";
import { AppShell } from "@/layout/app-shell";
import { ErrorPage } from "@/routes/error-page";

const DoctorHomePage = React.lazy(() => import("@/routes/shell-pages").then((module) => ({ default: module.DoctorHomePage })));
const SecretaryHomePage = React.lazy(() => import("@/routes/shell-pages").then((module) => ({ default: module.SecretaryHomePage })));
const PlaceholderPage = React.lazy(() => import("@/routes/shell-pages").then((module) => ({ default: module.PlaceholderPage })));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <React.Suspense fallback={<PageSkeleton />}>{children}</React.Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
    errorElement: <ErrorPage />
  },
  {
    element: <PublicOnlyRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            element: <ProtectedRoute allowedRoles={["DOCTOR"]} />,
            children: [
              {
                path: "/doctor",
                element: (
                  <LazyPage>
                    <DoctorHomePage />
                  </LazyPage>
                )
              },
              {
                path: "/visits",
                element: (
                  <LazyPage>
                    <PlaceholderPage title="Visits" description="Visit workspace routes are prepared for SPEC 02 implementation." />
                  </LazyPage>
                )
              },
              {
                path: "/prescriptions",
                element: (
                  <LazyPage>
                    <PlaceholderPage title="Prescriptions" description="Prescription builder routes are prepared for SPEC 02 implementation." />
                  </LazyPage>
                )
              }
            ]
          },
          {
            element: <ProtectedRoute allowedRoles={["SECRETARY"]} />,
            children: [
              {
                path: "/secretary",
                element: (
                  <LazyPage>
                    <SecretaryHomePage />
                  </LazyPage>
                )
              }
            ]
          },
          {
            path: "/patients",
            element: (
              <LazyPage>
                <PlaceholderPage title="Patients" description="Patient management routes are prepared for SPEC 02 implementation." />
              </LazyPage>
            )
          },
          {
            path: "/patients/:patientId",
            element: (
              <LazyPage>
                <PlaceholderPage title="Patient profile" description="Patient profile will be implemented in the clinic workflow specification." />
              </LazyPage>
            )
          },
          {
            path: "/appointments",
            element: (
              <LazyPage>
                <PlaceholderPage title="Appointments" description="Appointment management routes are prepared for SPEC 02 implementation." />
              </LazyPage>
            )
          },
          {
            path: "/payments",
            element: (
              <LazyPage>
                <PlaceholderPage title="Payments" description="Payment workflow routes are prepared for SPEC 02 implementation." />
              </LazyPage>
            )
          },
          {
            path: "/settings",
            element: (
              <LazyPage>
                <PlaceholderPage title="Settings" description="Application settings shell is ready for future preference and clinic profile screens." />
              </LazyPage>
            )
          }
        ]
      }
    ]
  }
]);
