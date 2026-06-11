import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{data.patientCode}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">{data.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{data.clinic}</p>
          </div>
          <Button type="button" onClick={() => setEditOpen(true)}>
            Edit patient
          </Button>
        </div>
      </section>

      <Card>
        <CardContent className="p-5">
          <PatientProfileTabs patient={data} />
        </CardContent>
      </Card>

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
