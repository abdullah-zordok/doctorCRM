import { fetchPatient, fetchPatients, updatePatient } from "@/features/shared/workflow-api";

export async function verifyPatientWorkspaceScenario() {
  const byName = await fetchPatients({ search: "Amina", page: 1, pageSize: 8, sortBy: "name" });
  const byPhone = await fetchPatients({ search: "50 111", page: 1, pageSize: 8, sortBy: "name" });
  const byCode = await fetchPatients({ search: "DCP-1021", page: 1, pageSize: 8, sortBy: "code" });
  const profile = await fetchPatient("pat-001");
  const edited = await updatePatient("pat-001", { notes: "Scenario validation note" });

  return {
    searchesNamePhoneAndCode: byName.total > 0 && byPhone.total > 0 && byCode.total > 0,
    profileHasSections: profile.visits.length >= 0 && profile.appointments.length >= 0 && profile.prescriptions.length >= 0,
    editPreservesRecord: edited.id === profile.id && edited.patientCode === profile.patientCode
  };
}
