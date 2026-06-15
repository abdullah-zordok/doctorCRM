import type {
  AppointmentRecord,
  DashboardItem,
  DashboardMetric,
  DashboardPriority,
  DashboardSummary,
  PatientProfile,
  PatientRecord,
  PatientSummaryRecord,
  PatientTimelineEvent,
  PaginatedWorkflowResult,
  PrescriptionRecord,
  QuickAction,
  VisitRecord,
  WorkflowRole,
  WorkflowSearchResult
} from "@/types/workflow";
import { workflowRoutes } from "@/routes/workflow-routes";
import { sortAppointmentsByPriority } from "@/features/shared/workflow-status";
import i18n from "@/i18n";
import { formatDate, formatDateTime, formatTime } from "@/i18n/format";

type WorkflowStore = {
  patients: PatientRecord[];
  appointments: AppointmentRecord[];
  visits: VisitRecord[];
  prescriptions: PrescriptionRecord[];
  timelineByPatientId: Record<string, PatientTimelineEvent[]>;
};

type PatientQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "recent" | "code";
};

type AppointmentQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: "all" | AppointmentRecord["status"];
};

type MedicationInput = {
  id?: string;
  name: string;
  dosage: string;
  duration: string;
  notes?: string;
};

type PrescriptionInput = {
  medicines: MedicationInput[];
  instructions: string;
  notes: string;
};

type VisitUpdateInput = {
  chiefComplaint: string;
  diagnosis: string;
  clinicalNotes: string;
  followUpNotes: string;
};

type AppointmentInput = {
  patientId: string;
  scheduledAt: string;
  reason: string;
  notes: string;
  priority: DashboardPriority;
  assignedTo: WorkflowRole | "BOTH";
};

type PatientInput = {
  name: string;
  phone: string;
  clinic: string;
  notes?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  isActive?: boolean;
};

const today = new Date();

function toIsoDateTime(offsetDays: number, hours: number, minutes = 0) {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function delay(ms = 140) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

const seedPatients: PatientRecord[] = [
  {
    id: "pat-001",
    patientCode: "DCP-1021",
    name: "Amina Hassan",
    phone: "+966 50 111 2233",
    clinic: "General Medicine",
    notes: "Prefers morning visits.",
    isActive: true,
    email: "amina.hassan@example.com",
    dateOfBirth: "1987-04-12",
    address: "Riyadh, Al Malaz",
    gender: "Female",
    medicalHistory: ["Hypertension", "Seasonal allergies"],
    allergies: ["Penicillin"],
    lastVisitAt: toIsoDateTime(-1, 9, 30),
    visitCount: 4
  },
  {
    id: "pat-002",
    patientCode: "DCP-1044",
    name: "Omar Saleh",
    phone: "+966 55 222 3344",
    clinic: "Family Medicine",
    notes: "Follow up after lab review.",
    isActive: true,
    email: "omar.saleh@example.com",
    dateOfBirth: "1979-11-07",
    address: "Riyadh, Al Olaya",
    gender: "Male",
    medicalHistory: ["Type 2 diabetes"],
    allergies: [],
    lastVisitAt: toIsoDateTime(-2, 11, 0),
    visitCount: 7
  },
  {
    id: "pat-003",
    patientCode: "DCP-1088",
    name: "Nour Al-Qahtani",
    phone: "+966 54 333 4455",
    clinic: "Pediatrics",
    notes: "New patient registration today.",
    isActive: true,
    email: "nour.qahtani@example.com",
    dateOfBirth: "2016-03-18",
    address: "Riyadh, Al Nakheel",
    gender: "Female",
    medicalHistory: ["None recorded"],
    allergies: ["Latex"],
    lastVisitAt: toIsoDateTime(-6, 10, 0),
    visitCount: 1
  },
  {
    id: "pat-004",
    patientCode: "DCP-1099",
    name: "Fahad Al-Mutairi",
    phone: "+966 53 444 5566",
    clinic: "Orthopedics",
    notes: "Waiting for imaging review.",
    isActive: true,
    email: "fahad.mutairi@example.com",
    dateOfBirth: "1991-02-25",
    address: "Riyadh, Al Yasmin",
    gender: "Male",
    medicalHistory: ["Knee pain"],
    allergies: ["NSAIDs"],
    lastVisitAt: toIsoDateTime(-3, 13, 45),
    visitCount: 3
  },
  {
    id: "pat-005",
    patientCode: "DCP-1110",
    name: "Sarah Abdullah",
    phone: "+966 56 555 6677",
    clinic: "General Medicine",
    notes: "Prefers text reminders.",
    isActive: true,
    email: "sarah.abdullah@example.com",
    dateOfBirth: "1984-09-09",
    address: "Riyadh, Al Arid",
    gender: "Female",
    medicalHistory: ["Migraines"],
    allergies: [],
    lastVisitAt: toIsoDateTime(-4, 8, 15),
    visitCount: 6
  }
];

const seedVisits: VisitRecord[] = [
  {
    id: "vis-001",
    patientId: "pat-001",
    patientName: "Amina Hassan",
    visitDate: toIsoDateTime(0, 9, 15),
    chiefComplaint: "Headache and dizziness",
    diagnosis: "Dehydration with tension headache",
    clinicalNotes: "Patient reports reduced fluid intake and poor sleep.",
    followUpNotes: "Encourage hydration and follow up in 5 days.",
    status: "open",
    doctorName: "Dr. Khalid",
    room: "Room 3",
    queuePosition: 1
  },
  {
    id: "vis-002",
    patientId: "pat-002",
    patientName: "Omar Saleh",
    visitDate: toIsoDateTime(-1, 11, 20),
    chiefComplaint: "Blood sugar review",
    diagnosis: "Type 2 diabetes follow-up",
    clinicalNotes: "Home readings improved since medication adjustment.",
    followUpNotes: "Continue current regimen and review lab work.",
    status: "completed",
    doctorName: "Dr. Khalid",
    room: "Room 1",
    completedAt: toIsoDateTime(-1, 11, 55)
  },
  {
    id: "vis-003",
    patientId: "pat-003",
    patientName: "Nour Al-Qahtani",
    visitDate: toIsoDateTime(-6, 10, 10),
    chiefComplaint: "Fever and cough",
    diagnosis: "Viral upper respiratory infection",
    clinicalNotes: "Symptoms mild, no red flags.",
    followUpNotes: "Rest, fluids, and return if symptoms worsen.",
    status: "completed",
    doctorName: "Dr. Lina",
    room: "Room 2",
    completedAt: toIsoDateTime(-6, 10, 40)
  },
  {
    id: "vis-004",
    patientId: "pat-004",
    patientName: "Fahad Al-Mutairi",
    visitDate: toIsoDateTime(0, 14, 0),
    chiefComplaint: "Knee pain after exercise",
    diagnosis: "Mild knee strain",
    clinicalNotes: "Tenderness around the patella with limited flexion.",
    followUpNotes: "Review after imaging results.",
    status: "open",
    doctorName: "Dr. Khalid",
    room: "Room 4",
    queuePosition: 2
  },
  {
    id: "vis-005",
    patientId: "pat-005",
    patientName: "Sarah Abdullah",
    visitDate: toIsoDateTime(-4, 8, 30),
    chiefComplaint: "Recurring migraine",
    diagnosis: "Chronic migraine without aura",
    clinicalNotes: "No neurological deficits observed.",
    followUpNotes: "Monitor frequency and response to therapy.",
    status: "completed",
    doctorName: "Dr. Nadia",
    room: "Room 2",
    completedAt: toIsoDateTime(-4, 9, 5)
  }
];

const seedPrescriptions: PrescriptionRecord[] = [
  {
    id: "pre-001",
    visitId: "vis-002",
    patientId: "pat-002",
    patientName: "Omar Saleh",
    visitDate: toIsoDateTime(-1, 11, 20),
    medicines: [
      { id: "med-001", name: "Metformin", dosage: "500mg twice daily", duration: "30 days", notes: "Take with meals" },
      { id: "med-002", name: "Vitamin D", dosage: "1000 IU daily", duration: "30 days", notes: "After breakfast" }
    ],
    instructions: "Continue glucose monitoring and review after lab results.",
    notes: "Maintain diet and activity plan.",
    status: "issued",
    createdAt: toIsoDateTime(-1, 12, 0),
    printableLabel: "Prescription ready for print",
    printableLabelKey: "prescriptions.preview.readyForPrint"
  }
];

const seedAppointments: AppointmentRecord[] = [
  {
    id: "app-001",
    patientId: "pat-001",
    patientName: "Amina Hassan",
    patientCode: "DCP-1021",
    scheduledAt: toIsoDateTime(0, 8, 45),
    status: "waiting",
    notes: "Arrived early and checked in.",
    priority: "urgent",
    reason: "Acute symptoms review",
    assignedTo: "DOCTOR"
  },
  {
    id: "app-002",
    patientId: "pat-002",
    patientName: "Omar Saleh",
    patientCode: "DCP-1044",
    scheduledAt: toIsoDateTime(0, 9, 30),
    status: "completed",
    notes: "Visit completed and chart closed.",
    priority: "medium",
    reason: "Diabetes follow-up",
    assignedTo: "DOCTOR"
  },
  {
    id: "app-003",
    patientId: "pat-003",
    patientName: "Nour Al-Qahtani",
    patientCode: "DCP-1088",
    scheduledAt: toIsoDateTime(0, 10, 15),
    status: "scheduled",
    notes: "New patient registration and first consultation.",
    priority: "high",
    reason: "New patient registration",
    assignedTo: "SECRETARY"
  },
  {
    id: "app-004",
    patientId: "pat-004",
    patientName: "Fahad Al-Mutairi",
    patientCode: "DCP-1099",
    scheduledAt: toIsoDateTime(0, 11, 0),
    status: "waiting",
    notes: "Needs quick triage before consultation.",
    priority: "high",
    reason: "Knee pain follow-up",
    assignedTo: "BOTH"
  },
  {
    id: "app-005",
    patientId: "pat-005",
    patientName: "Sarah Abdullah",
    patientCode: "DCP-1110",
    scheduledAt: toIsoDateTime(0, 12, 15),
    status: "cancelled",
    notes: "Patient called to reschedule.",
    priority: "low",
    reason: "Migraine review",
    assignedTo: "SECRETARY"
  }
];

function createTimelineSeed(): Record<string, PatientTimelineEvent[]> {
  return {
    "pat-001": [
      {
        id: "timeline-001",
        type: "appointment",
        occurredAt: toIsoDateTime(0, 8, 45),
        title: "Appointment waiting",
        titleKey: "patients.system.appointmentWaiting",
        description: "Checked in for acute symptom review.",
        status: "waiting",
        sourceId: "app-001"
      },
      {
        id: "timeline-002",
        type: "visit",
        occurredAt: toIsoDateTime(-2, 10, 0),
        title: "Previous visit completed",
        titleKey: "patients.system.previousVisitCompleted",
        description: "Hydration and sleep guidance recorded.",
        status: "completed",
        sourceId: "vis-010"
      }
    ],
    "pat-002": [
      {
        id: "timeline-003",
        type: "visit",
        occurredAt: toIsoDateTime(-1, 11, 55),
        title: "Completed diabetes follow-up",
        titleKey: "patients.system.diabetesFollowUpCompleted",
        description: "Medication plan updated and prescription issued.",
        status: "completed",
        sourceId: "vis-002"
      },
      {
        id: "timeline-004",
        type: "prescription",
        occurredAt: toIsoDateTime(-1, 12, 0),
        title: "Prescription issued",
        titleKey: "patients.system.prescriptionIssued",
        description: "Metformin and vitamin D prescription generated.",
        status: "issued",
        sourceId: "pre-001"
      }
    ],
    "pat-003": [
      {
        id: "timeline-005",
        type: "visit",
        occurredAt: toIsoDateTime(-6, 10, 40),
        title: "Completed pediatric visit",
        titleKey: "patients.system.pediatricVisitCompleted",
        description: "Viral illness advice recorded.",
        status: "completed",
        sourceId: "vis-003"
      }
    ],
    "pat-004": [
      {
        id: "timeline-006",
        type: "appointment",
        occurredAt: toIsoDateTime(0, 11, 0),
        title: "Waiting appointment",
        titleKey: "patients.system.waitingAppointment",
        description: "Needs triage for knee strain.",
        status: "waiting",
        sourceId: "app-004"
      }
    ],
    "pat-005": [
      {
        id: "timeline-007",
        type: "appointment",
        occurredAt: toIsoDateTime(0, 12, 15),
        title: "Appointment cancelled",
        titleKey: "patients.system.appointmentCancelled",
        description: "Reschedule requested by patient.",
        status: "cancelled",
        sourceId: "app-005"
      }
    ]
  };
}

const store: WorkflowStore = {
  patients: clone(seedPatients),
  appointments: clone(seedAppointments),
  visits: clone(seedVisits),
  prescriptions: clone(seedPrescriptions),
  timelineByPatientId: createTimelineSeed()
};

function normalizeQuery(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function matchesPatient(patient: PatientRecord, query: string) {
  if (!query) {
    return true;
  }

  return [patient.name, patient.phone, patient.patientCode, patient.clinic, patient.notes ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function matchesAppointment(appointment: AppointmentRecord, query: string) {
  if (!query) {
    return true;
  }

  return [appointment.patientName, appointment.patientCode, appointment.reason, appointment.notes]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function matchesVisit(visit: VisitRecord, query: string) {
  if (!query) {
    return true;
  }

  return [visit.patientName, visit.chiefComplaint, visit.diagnosis, visit.clinicalNotes, visit.followUpNotes]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function matchesPrescription(prescription: PrescriptionRecord, query: string) {
  if (!query) {
    return true;
  }

  return [prescription.patientName, prescription.instructions, prescription.notes, prescription.medicines.map((medicine) => medicine.name).join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function getRoleMetrics(role: WorkflowRole, language: string): DashboardMetric[] {
  const t = i18n.getFixedT(language);
  const waitingAppointments = store.appointments.filter((appointment) => appointment.status === "waiting");
  const completedVisits = store.visits.filter((visit) => visit.status === "completed");
  const newPatients = store.patients.filter((patient) => patient.visitCount <= 1);

  if (role === "DOCTOR") {
    return [
      { label: t("dashboard.metrics.waitingPatients"), value: String(waitingAppointments.length), tone: "warning", trend: t("dashboard.metrics.requiresAttention") },
      { label: t("dashboard.metrics.openVisits"), value: String(store.visits.filter((visit) => visit.status === "open").length), tone: "default", trend: t("dashboard.metrics.activeConsultations") },
      { label: t("dashboard.metrics.todayCompleted"), value: String(completedVisits.filter((visit) => visit.visitDate.startsWith(today.toISOString().slice(0, 10))).length), tone: "success", trend: t("dashboard.metrics.closedToday") }
    ];
  }

  return [
    { label: t("dashboard.metrics.todayAppointments"), value: String(store.appointments.filter((appointment) => appointment.scheduledAt.startsWith(today.toISOString().slice(0, 10))).length), tone: "default", trend: t("dashboard.metrics.frontDeskSchedule") },
    { label: t("dashboard.metrics.waitingPatients"), value: String(waitingAppointments.length), tone: "warning", trend: t("dashboard.metrics.queueReady") },
    { label: t("dashboard.metrics.newPatients"), value: String(newPatients.length), tone: "success", trend: t("dashboard.metrics.readyToRegister") }
  ];
}

function getRoleQuickActions(role: WorkflowRole, language: string): QuickAction[] {
  const t = i18n.getFixedT(language);
  const doctorActions: QuickAction[] = [
    { id: "qa-doctor-visit", label: t("dashboard.actions.startVisit"), target: { label: t("dashboard.actions.openVisits"), href: workflowRoutes.visitWorkspace("vis-001") }, role: "DOCTOR", context: t("dashboard.actions.moveToConsultation") },
    { id: "qa-doctor-patient", label: t("dashboard.actions.editPatient"), target: { label: t("dashboard.actions.openPatients"), href: workflowRoutes.patientProfile("pat-001") }, role: "DOCTOR" },
    { id: "qa-doctor-prescription", label: t("dashboard.actions.generatePrescription"), target: { label: t("dashboard.actions.newPrescription"), href: workflowRoutes.prescriptionBuilder("vis-001") }, role: "DOCTOR" }
  ];

  const secretaryActions: QuickAction[] = [
    { id: "qa-secretary-register", label: t("dashboard.actions.addPatient"), target: { label: t("navigation.patients"), href: workflowRoutes.patients }, role: "SECRETARY", context: t("dashboard.actions.createPatient") },
    { id: "qa-secretary-book", label: t("dashboard.actions.bookAppointment"), target: { label: t("navigation.appointments"), href: workflowRoutes.appointments }, role: "SECRETARY" },
    { id: "qa-secretary-search", label: t("dashboard.actions.searchPatient"), target: { label: t("navigation.patients"), href: workflowRoutes.patients }, role: "SECRETARY" }
  ];

  return role === "DOCTOR" ? doctorActions : secretaryActions;
}

function buildDashboard(role: WorkflowRole, language: string): DashboardSummary {
  const t = i18n.getFixedT(language);
  const waitingAppointments = sortAppointmentsByPriority(
    store.appointments.filter((appointment) => appointment.status === "waiting" || appointment.status === "scheduled" || appointment.status === "completed")
  );
  const activeVisits = store.visits.filter((visit) => visit.status === "open");
  const recentPatients = [...store.patients].sort((left, right) => (right.lastVisitAt ?? "").localeCompare(left.lastVisitAt ?? ""));
  const upcomingAppointments = store.appointments.filter((appointment) => appointment.status !== "cancelled").slice(0, 4);
  const newPatients = store.patients.filter((patient) => patient.visitCount <= 1);

  const items: DashboardItem[] = role === "DOCTOR"
    ? [
        ...waitingAppointments.slice(0, 3).map((appointment, index) => ({
          id: appointment.id,
          type: "waiting-patient" as const,
          title: appointment.patientName,
          subtitle: `${appointment.reason} - ${formatTime(appointment.scheduledAt, language)}`,
          priority: index === 0 ? "urgent" as const : "high" as const,
          status: appointment.status,
          actionLabel: t("dashboard.actions.openQueue"),
          target: { label: t("dashboard.actions.openVisit"), href: workflowRoutes.visitWorkspace(activeVisits[0]?.id ?? "vis-001") },
          role,
          metadata: { patientId: appointment.patientId, appointmentId: appointment.id }
        })),
        ...activeVisits.slice(0, 2).map((visit) => ({
          id: visit.id,
          type: "today-visit" as const,
          title: visit.patientName,
          subtitle: `${visit.chiefComplaint} - ${visit.room}`,
          priority: "high" as const,
          status: visit.status,
          actionLabel: t("dashboard.actions.continueVisit"),
          target: { label: t("dashboard.actions.visitWorkspace"), href: workflowRoutes.visitWorkspace(visit.id) },
          role,
          metadata: { patientId: visit.patientId, visitId: visit.id }
        })),
        ...recentPatients.slice(0, 2).map((patient) => ({
          id: patient.id,
          type: "recent-patient" as const,
          title: patient.name,
          subtitle: `${patient.patientCode} - ${patient.phone}`,
          priority: "medium" as const,
          status: "completed" as const,
          actionLabel: t("dashboard.actions.openProfile"),
          target: { label: t("dashboard.actions.patientProfile"), href: workflowRoutes.patientProfile(patient.id) },
          role,
          metadata: { patientId: patient.id }
        })),
        ...upcomingAppointments.slice(0, 2).map((appointment) => ({
          id: `${appointment.id}-upcoming`,
          type: "upcoming-appointment" as const,
          title: appointment.patientName,
          subtitle: `${appointment.reason} - ${formatDateTime(appointment.scheduledAt, language, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`,
          priority: "medium" as const,
          status: appointment.status,
          actionLabel: t("dashboard.actions.reviewSchedule"),
          target: { label: t("navigation.appointments"), href: workflowRoutes.appointments },
          role,
          metadata: { appointmentId: appointment.id, patientId: appointment.patientId }
        }))
      ]
    : [
        ...upcomingAppointments.slice(0, 3).map((appointment) => ({
          id: appointment.id,
          type: "upcoming-appointment" as const,
          title: appointment.patientName,
          subtitle: `${appointment.reason} - ${formatTime(appointment.scheduledAt, language)}`,
          priority: appointment.status === "waiting" ? "urgent" as const : "high" as const,
          status: appointment.status,
          actionLabel: appointment.status === "waiting" ? t("dashboard.actions.checkIn") : t("dashboard.actions.openBooking"),
          target: { label: t("navigation.appointments"), href: workflowRoutes.appointments },
          role,
          metadata: { appointmentId: appointment.id, patientId: appointment.patientId }
        })),
        ...waitingAppointments.slice(0, 2).map((appointment) => ({
          id: `${appointment.id}-queue`,
          type: "waiting-patient" as const,
          title: appointment.patientName,
          subtitle: `${appointment.patientCode} - ${appointment.reason}`,
          priority: "urgent" as const,
          status: appointment.status,
          actionLabel: t("dashboard.actions.registerBook"),
          target: { label: t("navigation.patients"), href: workflowRoutes.patients },
          role,
          metadata: { appointmentId: appointment.id, patientId: appointment.patientId }
        })),
        ...newPatients.slice(0, 2).map((patient) => ({
          id: `${patient.id}-new`,
          type: "new-patient" as const,
          title: patient.name,
          subtitle: `${patient.patientCode} - ${patient.phone}`,
          priority: "high" as const,
          status: "scheduled" as const,
          actionLabel: t("dashboard.actions.registerNow"),
          target: { label: t("navigation.patients"), href: workflowRoutes.patients },
          role,
          metadata: { patientId: patient.id }
        })),
        ...store.visits.filter((visit) => visit.status === "completed").slice(0, 2).map((visit) => ({
          id: `${visit.id}-completed`,
          type: "completed-visit" as const,
          title: visit.patientName,
          subtitle: `${visit.diagnosis} - ${formatDate(visit.completedAt ?? visit.visitDate, language)}`,
          priority: "medium" as const,
          status: visit.status,
          actionLabel: t("dashboard.actions.reviewHistory"),
          target: { label: t("navigation.patients"), href: workflowRoutes.patientProfile(visit.patientId) },
          role,
          metadata: { patientId: visit.patientId, visitId: visit.id }
        }))
      ];

  return {
    role,
    title: t(role === "DOCTOR" ? "dashboard.doctor.title" : "dashboard.secretary.title"),
    subtitle: t(role === "DOCTOR" ? "dashboard.doctor.description" : "dashboard.secretary.description"),
    items,
    metrics: getRoleMetrics(role, language),
    quickActions: getRoleQuickActions(role, language).filter((action) => action.role === role || action.role === "BOTH")
  };
}

function buildPatientProfile(patient: PatientRecord): PatientProfile {
  const visits = store.visits.filter((visit) => visit.patientId === patient.id);
  const prescriptions = store.prescriptions.filter((prescription) => prescription.patientId === patient.id);
  const appointments = store.appointments.filter((appointment) => appointment.patientId === patient.id);
  const timeline = store.timelineByPatientId[patient.id] ?? [];

  return {
    ...clone(patient),
    timeline: clone(timeline),
    visits: clone(visits),
    prescriptions: clone(prescriptions),
    appointments: clone(appointments),
    payments: [
      {
        id: `${patient.id}-payment-1`,
        occurredAt: toIsoDateTime(-2, 13, 0),
        title: "Consultation fee",
        titleKey: "patients.system.consultationFee",
        amount: "SAR 200",
        status: "paid"
      }
    ]
  };
}

function paginate<T>(items: T[], page = 1, pageSize = 8): PaginatedWorkflowResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: currentPage,
    pageSize,
    total,
    totalPages
  };
}

export async function fetchDashboard(role: WorkflowRole, language = i18n.resolvedLanguage ?? i18n.language): Promise<DashboardSummary> {
  await delay();
  return clone(buildDashboard(role, language));
}

export async function fetchPatients(query: PatientQuery = {}): Promise<PaginatedWorkflowResult<PatientSummaryRecord>> {
  await delay();

  const normalized = normalizeQuery(query.search);
  const filtered = store.patients
    .filter((patient) => matchesPatient(patient, normalized))
    .sort((left, right) => {
      if (query.sortBy === "code") {
        return left.patientCode.localeCompare(right.patientCode);
      }
      if (query.sortBy === "recent") {
        return (right.lastVisitAt ?? "").localeCompare(left.lastVisitAt ?? "");
      }
      return left.name.localeCompare(right.name);
    })
    .map(({ id, patientCode, name, phone, clinic, notes, isActive }) => ({ id, patientCode, name, phone, clinic, notes, isActive }));

  return paginate(filtered, query.page, query.pageSize);
}

export async function fetchPatient(patientId: string): Promise<PatientProfile> {
  await delay();
  const patient = store.patients.find((entry) => entry.id === patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return clone(buildPatientProfile(patient));
}

export async function updatePatient(patientId: string, input: Partial<PatientRecord>): Promise<PatientProfile> {
  await delay();
  const patient = store.patients.find((entry) => entry.id === patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  Object.assign(patient, {
    name: input.name?.trim() ?? patient.name,
    phone: input.phone?.trim() ?? patient.phone,
    clinic: input.clinic?.trim() ?? patient.clinic,
    notes: input.notes ?? patient.notes,
    email: input.email ?? patient.email,
    dateOfBirth: input.dateOfBirth ?? patient.dateOfBirth,
    address: input.address ?? patient.address,
    gender: input.gender ?? patient.gender,
    isActive: input.isActive ?? patient.isActive
  });

  return clone(buildPatientProfile(patient));
}

export async function createPatient(input: PatientInput): Promise<PatientProfile> {
  await delay();
  const patientNumber = 1120 + store.patients.length;
  const patient: PatientRecord = {
    id: createId("pat"),
    patientCode: `DCP-${patientNumber}`,
    name: input.name.trim(),
    phone: input.phone.trim(),
    clinic: input.clinic.trim(),
    notes: input.notes ?? "",
    isActive: input.isActive ?? true,
    email: input.email,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    address: input.address,
    medicalHistory: [],
    allergies: [],
    lastVisitAt: undefined,
    visitCount: 0
  };

  store.patients.unshift(patient);
  store.timelineByPatientId[patient.id] = [
    {
      id: createId("timeline"),
      type: "note",
      occurredAt: new Date().toISOString(),
      title: "Patient registered",
      titleKey: "patients.system.patientRegistered",
      description: "Patient record created from the clinic workflow.",
      status: "completed",
      sourceId: patient.id
    }
  ];

  return clone(buildPatientProfile(patient));
}

export async function fetchVisit(visitId: string) {
  await delay();
  const visit = store.visits.find((entry) => entry.id === visitId);
  if (!visit) {
    throw new Error("Visit not found");
  }
  const patient = store.patients.find((entry) => entry.id === visit.patientId);
  const prescription = store.prescriptions.find((entry) => entry.visitId === visit.id) ?? null;
  return clone({
    visit,
    patient: patient ? buildPatientProfile(patient) : null,
    prescription
  });
}

export async function updateVisit(visitId: string, input: VisitUpdateInput) {
  await delay();
  const visit = store.visits.find((entry) => entry.id === visitId);
  if (!visit) {
    throw new Error("Visit not found");
  }

  Object.assign(visit, {
    chiefComplaint: input.chiefComplaint,
    diagnosis: input.diagnosis,
    clinicalNotes: input.clinicalNotes,
    followUpNotes: input.followUpNotes
  });

  return clone(visit);
}

export async function finishVisit(visitId: string, input: VisitUpdateInput) {
  await delay();
  const visit = store.visits.find((entry) => entry.id === visitId);
  if (!visit) {
    throw new Error("Visit not found");
  }

  Object.assign(visit, {
    ...input,
    status: "completed" as const,
    completedAt: new Date().toISOString()
  });

  const timeline = store.timelineByPatientId[visit.patientId] ?? [];
  timeline.unshift({
    id: createId("timeline"),
    type: "visit",
    occurredAt: visit.completedAt ?? new Date().toISOString(),
    title: "Visit completed",
    titleKey: "patients.system.visitCompleted",
    description: visit.diagnosis,
    status: "completed",
    sourceId: visit.id
  });
  store.timelineByPatientId[visit.patientId] = timeline;

  return clone(visit);
}

export async function fetchPrescriptionBuilderContext(visitId: string) {
  await delay();
  const visit = store.visits.find((entry) => entry.id === visitId);
  if (!visit) {
    throw new Error("Visit not found");
  }
  const patient = store.patients.find((entry) => entry.id === visit.patientId);
  const existing = store.prescriptions.find((entry) => entry.visitId === visitId) ?? null;

  return clone({
    visit,
    patient: patient ? buildPatientProfile(patient) : null,
    prescription: existing
  });
}

export async function createPrescription(visitId: string, input: PrescriptionInput) {
  await delay();
  const visit = store.visits.find((entry) => entry.id === visitId);
  if (!visit) {
    throw new Error("Visit not found");
  }

  const patient = store.patients.find((entry) => entry.id === visit.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const created: PrescriptionRecord = {
    id: createId("pre"),
    visitId,
    patientId: patient.id,
    patientName: patient.name,
    visitDate: visit.visitDate,
    medicines: input.medicines.map((medicine) => ({ ...medicine, id: medicine.id ?? createId("med") })),
    instructions: input.instructions,
    notes: input.notes,
    status: "issued",
    createdAt: new Date().toISOString(),
    printableLabel: "Printable prescription generated",
    printableLabelKey: "prescriptions.preview.generated"
  };

  store.prescriptions.unshift(created);
  const timeline = store.timelineByPatientId[patient.id] ?? [];
  timeline.unshift({
    id: createId("timeline"),
    type: "prescription",
    occurredAt: created.createdAt,
    title: "Prescription issued",
    titleKey: "patients.system.prescriptionIssued",
    description: created.medicines.map((medicine) => medicine.name).join(", "),
    status: "issued",
    sourceId: created.id
  });
  store.timelineByPatientId[patient.id] = timeline;

  return clone(created);
}

export async function fetchAppointments(query: AppointmentQuery = {}): Promise<PaginatedWorkflowResult<AppointmentRecord>> {
  await delay();
  const normalized = normalizeQuery(query.search);
  const filtered = sortAppointmentsByPriority(
    store.appointments.filter((appointment) => {
      const matchesStatus = query.status && query.status !== "all" ? appointment.status === query.status : true;
      return matchesStatus && matchesAppointment(appointment, normalized);
    })
  );

  return paginate(filtered, query.page, query.pageSize);
}

export async function createAppointment(input: AppointmentInput) {
  await delay();
  const patient = store.patients.find((entry) => entry.id === input.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const appointment: AppointmentRecord = {
    id: createId("app"),
    patientId: patient.id,
    patientName: patient.name,
    patientCode: patient.patientCode,
    scheduledAt: input.scheduledAt,
    status: "scheduled",
    notes: input.notes,
    priority: input.priority,
    reason: input.reason,
    assignedTo: input.assignedTo
  };

  store.appointments.unshift(appointment);
  const timeline = store.timelineByPatientId[patient.id] ?? [];
  timeline.unshift({
    id: createId("timeline"),
    type: "appointment",
    occurredAt: appointment.scheduledAt,
    title: "Appointment booked",
    titleKey: "patients.system.appointmentBooked",
    description: appointment.reason,
    status: "scheduled",
    sourceId: appointment.id
  });
  store.timelineByPatientId[patient.id] = timeline;

  return clone(appointment);
}

export async function updateAppointment(appointmentId: string, input: AppointmentInput) {
  await delay();
  const appointment = store.appointments.find((entry) => entry.id === appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found");
  }
  const patient = store.patients.find((entry) => entry.id === input.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  Object.assign(appointment, {
    patientId: patient.id,
    patientName: patient.name,
    patientCode: patient.patientCode,
    scheduledAt: input.scheduledAt,
    reason: input.reason,
    notes: input.notes,
    priority: input.priority,
    assignedTo: input.assignedTo
  });

  const timeline = store.timelineByPatientId[patient.id] ?? [];
  timeline.unshift({
    id: createId("timeline"),
    type: "appointment",
    occurredAt: new Date().toISOString(),
    title: "Appointment updated",
    titleKey: "patients.system.appointmentUpdated",
    description: appointment.reason,
    status: appointment.status,
    sourceId: appointment.id
  });
  store.timelineByPatientId[patient.id] = timeline;

  return clone(appointment);
}

export async function updateAppointmentStatus(appointmentId: string, status: AppointmentRecord["status"]) {
  await delay();
  const appointment = store.appointments.find((entry) => entry.id === appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  appointment.status = status;
  const timeline = store.timelineByPatientId[appointment.patientId] ?? [];
  timeline.unshift({
    id: createId("timeline"),
    type: "appointment",
    occurredAt: new Date().toISOString(),
    title: `Appointment ${status}`,
    titleKey: "patients.system.appointmentStatus",
    description: appointment.reason,
    status,
    sourceId: appointment.id
  });
  store.timelineByPatientId[appointment.patientId] = timeline;

  return clone(appointment);
}

export async function searchWorkflow(query: string, language = i18n.resolvedLanguage ?? i18n.language): Promise<WorkflowSearchResult[]> {
  await delay(80);
  const t = i18n.getFixedT(language);
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return [];
  }

  const results: WorkflowSearchResult[] = [
    ...store.patients.filter((patient) => matchesPatient(patient, normalized)).slice(0, 4).map((patient) => ({
      id: patient.id,
      type: "patient" as const,
      title: patient.name,
      subtitle: `${patient.patientCode} - ${patient.phone}`,
      target: { label: t("dashboard.actions.patientProfile"), href: workflowRoutes.patientProfile(patient.id) },
      status: "completed" as const
    })),
    ...store.appointments.filter((appointment) => matchesAppointment(appointment, normalized)).slice(0, 4).map((appointment) => ({
      id: appointment.id,
      type: "appointment" as const,
      title: appointment.patientName,
      subtitle: `${appointment.reason} - ${appointment.patientCode}`,
      target: { label: t("navigation.appointments"), href: workflowRoutes.appointments },
      status: appointment.status
    })),
    ...store.visits.filter((visit) => matchesVisit(visit, normalized)).slice(0, 4).map((visit) => ({
      id: visit.id,
      type: "visit" as const,
      title: visit.patientName,
      subtitle: `${visit.chiefComplaint} - ${visit.diagnosis}`,
      target: { label: t("dashboard.actions.visitWorkspace"), href: workflowRoutes.visitWorkspace(visit.id) },
      status: visit.status
    })),
    ...store.prescriptions.filter((prescription) => matchesPrescription(prescription, normalized)).slice(0, 4).map((prescription) => ({
      id: prescription.id,
      type: "prescription" as const,
      title: prescription.patientName,
      subtitle: `${prescription.printableLabelKey ? t(prescription.printableLabelKey) : prescription.printableLabel} - ${t("prescriptions.medicine.count", { count: prescription.medicines.length })}`,
      target: { label: t("prescriptions.title"), href: workflowRoutes.prescriptionBuilder(prescription.visitId) },
      status: prescription.status
    }))
  ];

  return clone(results.slice(0, 10));
}
