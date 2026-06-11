import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { PatientContextPanel } from "@/features/visits/patient-context-panel";
import { VisitForm, type VisitFormValues } from "@/features/visits/visit-form";
import { useFinishVisit, useVisit, useUpdateVisit } from "@/features/visits/visits.api";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { workflowRoutes } from "@/routes/workflow-routes";

export function VisitWorkspacePage() {
  const { visitId = "" } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = useVisit(visitId);
  const updateVisit = useUpdateVisit();
  const finishVisit = useFinishVisit();

  const handleSave = async (values: VisitFormValues) => {
    if (!data) {
      return;
    }
    await updateVisit.mutateAsync({ visitId: data.visit.id, data: values });
    notify({ type: "success", title: "Visit saved", description: "Clinical notes were updated without leaving the workspace." });
  };

  const handleFinish = async (values: VisitFormValues) => {
    if (!data) {
      return;
    }
    await finishVisit.mutateAsync({ visitId: data.visit.id, data: values });
    notify({ type: "success", title: "Visit completed", description: "The consultation has been closed and preserved in history." });
    navigate(workflowRoutes.patientProfile(data.visit.patientId));
  };

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data || !data.patient) {
    return <WorkflowErrorState title="Visit workspace unavailable" description="The consultation could not be loaded." onRetry={() => void refetch()} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{data.visit.room}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">Consultation workspace</h1>
            <p className="mt-2 text-sm text-muted-foreground">Single-page workflow for patient context, diagnosis, notes, and follow-up.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(workflowRoutes.prescriptionBuilder(data.visit.id))}>
              Generate prescription
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <VisitForm
          defaultValues={{
            chiefComplaint: data.visit.chiefComplaint,
            diagnosis: data.visit.diagnosis,
            clinicalNotes: data.visit.clinicalNotes,
            followUpNotes: data.visit.followUpNotes
          }}
          onSave={handleSave}
          onFinish={handleFinish}
          saving={updateVisit.isPending}
          finishing={finishVisit.isPending}
        />
        <PatientContextPanel patient={data.patient} visit={data.visit} prescription={data.prescription} />
      </div>
    </div>
  );
}
