import { CalendarPlus, Pencil, Phone, UserRound } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PatientForm, type PatientFormValues } from "@/features/patients/patient-form";
import { PatientProfileTabs } from "@/features/patients/patient-profile-tabs";
import { usePatientProfile, useUpdatePatient } from "@/features/patients/patients.api";
import { WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { useState } from "react";

export function PatientProfilePage() {
  const { patientId = "" } = useParams();
  const [editOpen, setEditOpen] = useState(false);
  const { data, isLoading, isError, refetch } = usePatientProfile(patientId);
  const updatePatient = useUpdatePatient();

  const handleSavePatient = async (values: PatientFormValues) => {
    if (!data) {
      return;
    }

    await updatePatient.mutateAsync({
      patientId: data.id,
      data: {
        name: values.name,
        phone: values.phone,
        clinic: values.clinic,
        email: values.email || undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        gender: values.gender || undefined,
        address: values.address || undefined,
        notes: values.notes || undefined,
        isActive: values.isActive === "true"
      }
    });
    setEditOpen(false);
  };

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data) {
    return <WorkflowErrorState title="Patient record unavailable" description="The patient profile could not be loaded." onRetry={() => void refetch()} />;
  }

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-secondary text-secondary-foreground">
              <UserRound className="h-7 w-7" />
            </span>
            <div>
              <p className="clinic-kicker">{data.patientCode}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight">{data.name}</h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{data.clinic}</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{data.phone}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline"><CalendarPlus className="h-4 w-4" /> Book appointment</Button>
            <Button type="button" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" /> Edit patient</Button>
          </div>
        </div>
      </section>

      <PatientProfileTabs patient={data} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit patient</DialogTitle>
            <DialogDescription>Update patient details while preserving the existing record history.</DialogDescription>
          </DialogHeader>
          <PatientForm defaultValues={data} onSubmit={handleSavePatient} submitLabel="Save changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
