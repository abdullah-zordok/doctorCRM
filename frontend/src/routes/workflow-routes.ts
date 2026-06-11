export const workflowRoutes = {
  doctorDashboard: "/doctor",
  secretaryDashboard: "/secretary",
  patients: "/patients",
  patientProfile: (patientId: string) => `/patients/${patientId}`,
  visitWorkspace: (visitId: string) => `/visits/${visitId}`,
  prescriptionBuilder: (visitId: string) => `/visits/${visitId}/prescriptions/new`,
  appointments: "/appointments"
} as const;
