import * as React from "react";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { useCreatePrescription, usePrescriptionBuilder } from "@/features/prescriptions/prescriptions.api";
import { MedicineTable } from "@/features/prescriptions/medicine-table";
import { PrescriptionPrintPreview } from "@/features/prescriptions/prescription-print-preview";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { workflowRoutes } from "@/routes/workflow-routes";

const prescriptionSchema = z.object({
  medicines: z.array(
    z.object({
      name: z.string().min(2, "Medicine name is required"),
      dosage: z.string().min(2, "Dosage is required"),
      duration: z.string().min(2, "Duration is required"),
      notes: z.string().optional().default("")
    })
  ).min(1, "Add at least one medicine"),
  instructions: z.string().min(5, "Instructions are required"),
  notes: z.string().optional().default("")
});

type PrescriptionValues = z.infer<typeof prescriptionSchema>;

export function PrescriptionBuilderPage() {
  const { visitId = "" } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const { data, isLoading, isError, refetch } = usePrescriptionBuilder(visitId);
  const createPrescription = useCreatePrescription();
  const form = useForm<PrescriptionValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medicines: [{ name: "", dosage: "", duration: "", notes: "" }],
      instructions: "",
      notes: ""
    }
  });
  const { register, control, handleSubmit, formState, reset, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });

  React.useEffect(() => {
    if (data?.prescription) {
      reset({
        medicines: data.prescription.medicines.map((medicine) => ({
          name: medicine.name,
          dosage: medicine.dosage,
          duration: medicine.duration,
          notes: medicine.notes ?? ""
        })),
        instructions: data.prescription.instructions,
        notes: data.prescription.notes
      });
    }
  }, [data, reset]);

  const handleSave = handleSubmit(async (values) => {
    await createPrescription.mutateAsync({
      visitId,
      data: values
    });
    notify({ type: "success", title: "Prescription saved", description: "Printable output is ready from stored prescription details." });
  });

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data || !data.visit || !data.patient) {
    return <WorkflowErrorState title="Prescription builder unavailable" description="The prescription workspace could not be loaded." onRetry={() => void refetch()} />;
  }

  const previewPrescription = data.prescription
    ? data.prescription
    : {
        id: "preview",
        visitId,
        patientId: data.patient.id,
        patientName: data.patient.name,
        visitDate: data.visit.visitDate,
        medicines: watch("medicines").map((medicine, index) => ({
          id: `preview-${index}`,
          name: medicine.name || "Medicine",
          dosage: medicine.dosage || "Dosage",
          duration: medicine.duration || "Duration",
          notes: medicine.notes || ""
        })),
        instructions: watch("instructions") || "Prescription instructions",
        notes: watch("notes") || "",
        status: "draft" as const,
        createdAt: new Date().toISOString(),
        printableLabel: "Draft preview"
      };

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="clinic-kicker">{data.patient.patientCode}</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight"><FileText className="h-7 w-7 text-primary" /> Prescription builder</h1>
            <p className="mt-2 text-sm text-muted-foreground">Multiple medicines, dosage, duration, notes, summary, and printable output.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(workflowRoutes.visitWorkspace(visitId))}>
              <ArrowLeft className="h-4 w-4" /> Back to visit
            </Button>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.7fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="text-base">Prescription details</CardTitle>
            <CardDescription>Quick entry for the consultation room.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border bg-accent/35 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Common templates</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setValue("medicines", [{ name: "Paracetamol", dosage: "500mg every 8 hours", duration: "5 days", notes: "After meals" }]);
                  setValue("instructions", "Rest, hydrate well, and return if symptoms worsen.");
                }}>General relief</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setValue("medicines", [{ name: "Amoxicillin", dosage: "500mg three times daily", duration: "7 days", notes: "Complete the full course" }]);
                  setValue("instructions", "Take doses evenly through the day and report any allergic reaction.");
                }}>Antibiotic course</Button>
              </div>
            </div>

            <MedicineTable fields={fields} register={register as unknown as typeof register} errors={formState.errors} append={append} remove={remove} />

            <Field label="Instructions" error={formState.errors.instructions?.message}>
              <textarea className="clinic-focus min-h-28 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("instructions")} />
            </Field>
            <Field label="Prescription notes" error={formState.errors.notes?.message}>
              <textarea className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("notes")} />
            </Field>

            <div className="flex justify-end">
              <Button type="button" size="lg" onClick={() => void handleSave()} disabled={createPrescription.isPending}>
                {createPrescription.isPending ? "Saving..." : "Save prescription"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="xl:sticky xl:top-28">
          <PrescriptionPrintPreview prescription={previewPrescription} visitLabel={data.visit.chiefComplaint} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
