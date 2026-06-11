/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PageSkeleton } from "@/components/ui/skeleton";
import { PublicOnlyRoute, ProtectedRoute, RootRedirect } from "@/features/auth/auth-routes";
import { LoginPage } from "@/features/auth/login-page";
import { AppShell } from "@/layout/app-shell";
import { ErrorPage } from "@/routes/error-page";
import { workflowRoutes } from "@/routes/workflow-routes";

const DoctorDashboardPage = React.lazy(() => import("@/features/dashboards/doctor-dashboard-page").then((module) => ({ default: module.DoctorDashboardPage })));
const SecretaryDashboardPage = React.lazy(() => import("@/features/dashboards/secretary-dashboard-page").then((module) => ({ default: module.SecretaryDashboardPage })));
const PatientsListPage = React.lazy(() => import("@/features/patients/patients-list-page").then((module) => ({ default: module.PatientsListPage })));
const PatientProfilePage = React.lazy(() => import("@/features/patients/patient-profile-page").then((module) => ({ default: module.PatientProfilePage })));
const VisitWorkspacePage = React.lazy(() => import("@/features/visits/visit-workspace-page").then((module) => ({ default: module.VisitWorkspacePage })));
const PrescriptionBuilderPage = React.lazy(() => import("@/features/prescriptions/prescription-builder-page").then((module) => ({ default: module.PrescriptionBuilderPage })));
const AppointmentsPage = React.lazy(() => import("@/features/appointments/appointments-page").then((module) => ({ default: module.AppointmentsPage })));
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
                    <DoctorDashboardPage />
                  </LazyPage>
                )
              },
              {
                path: "/visits",
                element: <Navigate to={workflowRoutes.visitWorkspace("vis-001")} replace />
              },
              {
                path: "/visits/:visitId",
                element: (
                  <LazyPage>
                    <VisitWorkspacePage />
                  </LazyPage>
                )
              },
              {
                path: "/visits/:visitId/prescriptions/new",
                element: (
                  <LazyPage>
                    <PrescriptionBuilderPage />
                  </LazyPage>
                )
              },
              {
                path: "/prescriptions",
                element: <Navigate to={workflowRoutes.prescriptionBuilder("vis-001")} replace />
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
                    <SecretaryDashboardPage />
                  </LazyPage>
                )
              }
            ]
          },
          {
            path: "/patients",
            element: (
              <LazyPage>
                <PatientsListPage />
              </LazyPage>
            )
          },
          {
            path: "/patients/:patientId",
            element: (
              <LazyPage>
                <PatientProfilePage />
              </LazyPage>
            )
          },
          {
            path: "/appointments",
            element: (
              <LazyPage>
                <AppointmentsPage />
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
