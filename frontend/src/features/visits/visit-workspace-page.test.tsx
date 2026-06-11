import { fetchVisit, finishVisit } from "@/features/shared/workflow-api";

export async function verifyVisitWorkspaceScenario() {
  const before = await fetchVisit("vis-001");
  const completed = await finishVisit("vis-001", {
    chiefComplaint: before.visit.chiefComplaint,
    diagnosis: before.visit.diagnosis,
    clinicalNotes: before.visit.clinicalNotes,
    followUpNotes: before.visit.followUpNotes
  });

  return {
    includesPatientContext: Boolean(before.patient?.id),
    requiresClinicalFields: Boolean(before.visit.chiefComplaint && before.visit.diagnosis),
    finishVisitClosesRecord: completed.status === "completed"
  };
}
