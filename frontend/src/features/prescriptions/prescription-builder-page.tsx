import * as React from "react";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { useCreatePrescription, usePrescriptionBuilder } from "@/features/prescriptions/prescriptions.api";
import { MedicineTable } from "@/features/prescriptions/medicine-table";
import { PrescriptionPrintPreview } from "@/features/prescriptions/prescription-print-preview";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { workflowRoutes } from "@/routes/workflow-routes";

function createPrescriptionSchema(t: (key: string) => string) {
  return z.object({
    medicines: z.array(
      z.object({
        name: z.string().min(2, t("validation.medicineName")),
        dosage: z.string().min(2, t("validation.dosage")),
        duration: z.string().min(2, t("validation.duration")),
        notes: z.string().optional().default("")
      })
    ).min(1, t("validation.medicineMinimum")),
    instructions: z.string().min(5, t("validation.instructions")),
    notes: z.string().optional().default("")
  });
}

type PrescriptionValues = z.infer<ReturnType<typeof createPrescriptionSchema>>;

export function PrescriptionBuilderPage() {
  const { t } = useTranslation();
  const prescriptionSchema = React.useMemo(() => createPrescriptionSchema(t), [t]);
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
    notify({ type: "success", title: t("prescriptions.saved"), description: t("prescriptions.savedDescription") });
  });

  if (isLoading) {
    return <WorkflowSkeleton />;
  }

  if (isError || !data || !data.visit || !data.patient) {
    return <WorkflowErrorState title={t("prescriptions.unavailable")} description={t("prescriptions.unavailableDescription")} onRetry={() => void refetch()} />;
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
          name: medicine.name || t("prescriptions.preview.medicine"),
          dosage: medicine.dosage || t("prescriptions.preview.dosage"),
          duration: medicine.duration || t("prescriptions.preview.duration"),
          notes: medicine.notes || ""
        })),
        instructions: watch("instructions") || t("prescriptions.preview.instructions"),
        notes: watch("notes") || "",
        status: "draft" as const,
        createdAt: new Date().toISOString(),
        printableLabel: t("prescriptions.preview.draft")
      };

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="clinic-kicker">{data.patient.patientCode}</p>
            <h1 className="mt-1 flex items-center gap-2 text-3xl font-bold tracking-tight"><FileText className="h-7 w-7 text-primary" /> {t("prescriptions.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("prescriptions.description")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => navigate(workflowRoutes.visitWorkspace(visitId))}>
              <ArrowLeft className="icon-directional h-4 w-4" /> {t("prescriptions.backToVisit")}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.7fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/20">
            <CardTitle className="text-base">{t("prescriptions.details")}</CardTitle>
            <CardDescription>{t("prescriptions.detailsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-2xl border bg-accent/35 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">{t("prescriptions.templates")}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setValue("medicines", [{ name: "Paracetamol", dosage: "500mg every 8 hours", duration: "5 days", notes: "After meals" }]);
                  setValue("instructions", "Rest, hydrate well, and return if symptoms worsen.");
                }}>{t("prescriptions.generalRelief")}</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setValue("medicines", [{ name: "Amoxicillin", dosage: "500mg three times daily", duration: "7 days", notes: "Complete the full course" }]);
                  setValue("instructions", "Take doses evenly through the day and report any allergic reaction.");
                }}>{t("prescriptions.antibioticCourse")}</Button>
              </div>
            </div>

            <MedicineTable fields={fields} register={register as unknown as typeof register} errors={formState.errors} append={append} remove={remove} />

            <Field label={t("prescriptions.instructions")} error={formState.errors.instructions?.message}>
              <textarea className="clinic-focus min-h-28 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("instructions")} />
            </Field>
            <Field label={t("prescriptions.notes")} error={formState.errors.notes?.message}>
              <textarea className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("notes")} />
            </Field>

            <div className="flex justify-end">
              <Button type="button" size="lg" onClick={() => void handleSave()} disabled={createPrescription.isPending}>
                {createPrescription.isPending ? t("common.saving") : t("prescriptions.save")}
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
