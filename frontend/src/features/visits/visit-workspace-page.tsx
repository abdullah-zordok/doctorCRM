import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FilePlus2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { PatientContextPanel } from "@/features/visits/patient-context-panel";
import { VisitForm, type VisitFormValues } from "@/features/visits/visit-form";
import { useFinishVisit, useVisit, useUpdateVisit } from "@/features/visits/visits.api";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { workflowRoutes } from "@/routes/workflow-routes";

export function VisitWorkspacePage() {
  const { t } = useTranslation();
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
    notify({ type: "success", title: t("visits.saved"), description: t("visits.savedDescription") });
  };

  const handleFinish = async (values: VisitFormValues) => {
    if (!data) {
      return;
    }
    await finishVisit.mutateAsync({ visitId: data.visit.id, data: values });
    notify({ type: "success", title: t("visits.completed"), description: t("visits.completedDescription") });
    navigate(workflowRoutes.patientProfile(data.visit.patientId));
  };

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data || !data.patient) {
    return <WorkflowErrorState title={t("visits.unavailable")} description={t("visits.unavailableDescription")} onRetry={() => void refetch()} />;
  }

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="clinic-kicker">{data.visit.room}</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight"><Stethoscope className="h-7 w-7 text-primary" /> {t("visits.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("visits.description")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(workflowRoutes.prescriptionBuilder(data.visit.id))}>
              <FilePlus2 className="h-4 w-4" /> {t("dashboard.actions.generatePrescription")}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
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
        <div className="xl:sticky xl:top-28">
          <PatientContextPanel patient={data.patient} visit={data.visit} prescription={data.prescription} />
        </div>
      </div>
    </div>
  );
}
