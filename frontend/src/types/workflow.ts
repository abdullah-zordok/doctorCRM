import type { Role } from "@/types/api";

export type WorkflowRole = Role;

export type DashboardPriority = "urgent" | "high" | "medium" | "low";

export type WorkflowStatus = "waiting" | "scheduled" | "open" | "completed" | "cancelled" | "draft" | "issued" | "no_show";

export type DashboardItemType =
  | "waiting-patient"
  | "today-visit"
  | "queue"
  | "recent-patient"
  | "upcoming-appointment"
  | "new-patient"
  | "completed-visit"
  | "patient-search"
  | "quick-action";

export type WorkflowTarget = {
  label: string;
  href: string;
};

export interface DashboardItem {
  id: string;
  type: DashboardItemType;
  title: string;
  subtitle: string;
  priority: DashboardPriority;
  status: WorkflowStatus;
  actionLabel: string;
  target: WorkflowTarget;
  role: WorkflowRole;
  metadata?: {
    patientId?: string;
    appointmentId?: string;
    visitId?: string;
    prescriptionId?: string;
  };
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend?: string;
  tone?: "default" | "success" | "warning" | "destructive";
}

export interface DashboardSummary {
  role: WorkflowRole;
  title: string;
  subtitle: string;
  items: DashboardItem[];
  metrics: DashboardMetric[];
  quickActions: QuickAction[];
}

export interface PatientSummaryRecord {
  id: string;
  patientCode: string;
  name: string;
  phone: string;
  clinic: string;
  notes?: string | null;
  isActive: boolean;
}

export interface PatientRecord extends PatientSummaryRecord {
  email?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
  medicalHistory: string[];
  allergies: string[];
  lastVisitAt?: string;
  visitCount: number;
}

export interface PatientTimelineEvent {
  id: string;
  type: "visit" | "appointment" | "prescription" | "note" | "payment";
  occurredAt: string;
  title: string;
  description: string;
  status: WorkflowStatus;
  sourceId: string;
}

export interface PatientProfile extends PatientRecord {
  timeline: PatientTimelineEvent[];
  visits: VisitRecord[];
  prescriptions: PrescriptionRecord[];
  appointments: AppointmentRecord[];
  payments: Array<{
    id: string;
    occurredAt: string;
    title: string;
    amount: string;
    status: "paid" | "pending" | "void";
  }>;
}

export interface VisitRecord {
  id: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpNotes: string;
  status: "open" | "completed" | "cancelled";
  doctorName: string;
  room: string;
  queuePosition?: number;
  completedAt?: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  notes?: string;
}

export interface PrescriptionRecord {
  id: string;
  visitId: string;
  patientId: string;
  patientName: string;
  visitDate: string;
  medicines: PrescriptionMedicine[];
  instructions: string;
  notes: string;
  status: "draft" | "issued";
  createdAt: string;
  printableLabel: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  scheduledAt: string;
  status: "waiting" | "scheduled" | "completed" | "cancelled" | "no_show";
  notes: string;
  priority: DashboardPriority;
  reason: string;
  assignedTo: WorkflowRole | "BOTH";
}

export interface QuickAction {
  id: string;
  label: string;
  target: WorkflowTarget;
  role: WorkflowRole | "BOTH";
  context?: string;
}

export interface WorkflowSearchResult {
  id: string;
  type: "patient" | "appointment" | "visit" | "prescription";
  title: string;
  subtitle: string;
  target: WorkflowTarget;
  status: WorkflowStatus;
}

export interface PaginatedWorkflowResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
