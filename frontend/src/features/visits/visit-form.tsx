import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClinicalFormShell } from "@/features/shared/clinical-form-shell";

function createVisitFormSchema(t: (key: string) => string) {
  return z.object({
    chiefComplaint: z.string().min(3, t("validation.chiefComplaint")),
    diagnosis: z.string().min(3, t("validation.diagnosis")),
    clinicalNotes: z.string().min(5, t("validation.clinicalNotes")),
    followUpNotes: z.string().min(3, t("validation.followUpNotes"))
  });
}

export type VisitFormValues = z.infer<ReturnType<typeof createVisitFormSchema>>;

type VisitFormProps = {
  defaultValues: VisitFormValues;
  onSave: (values: VisitFormValues) => void;
  onFinish: (values: VisitFormValues) => void;
  saving?: boolean;
  finishing?: boolean;
};

export function VisitForm({ defaultValues, onSave, onFinish, saving, finishing }: VisitFormProps) {
  const { t } = useTranslation();
  const visitFormSchema = React.useMemo(() => createVisitFormSchema(t), [t]);
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues
  });

  const { register, handleSubmit, formState } = form;

  return (
    <ClinicalFormShell
      title={t("visits.title")}
      description={t("visits.description")}
      primaryLabel={finishing ? t("visits.finishing") : t("visits.finishVisit")}
      secondaryLabel={saving ? t("visits.saving") : t("visits.saveDraft")}
      onPrimary={handleSubmit(onFinish)}
      onSecondary={handleSubmit(onSave)}
      primaryDisabled={saving || finishing}
    >
      <div className="space-y-6">
        <div className="grid gap-4 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-3">
          <Field label={t("visits.bloodPressure")}>
            <Input placeholder={t("common.notRecorded")} aria-label={t("visits.reference", { field: t("visits.bloodPressure") })} disabled />
          </Field>
          <Field label={t("visits.pulse")}>
            <Input placeholder={t("common.notRecorded")} aria-label={t("visits.reference", { field: t("visits.pulse") })} disabled />
          </Field>
          <Field label={t("visits.temperature")}>
            <Input placeholder={t("common.notRecorded")} aria-label={t("visits.reference", { field: t("visits.temperature") })} disabled />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={t("visits.chiefComplaint")} error={formState.errors.chiefComplaint?.message}>
            <Input {...register("chiefComplaint")} />
          </Field>
          <Field label={t("visits.diagnosis")} error={formState.errors.diagnosis?.message}>
            <Input {...register("diagnosis")} />
          </Field>
        </div>
        <Field label={t("visits.clinicalNotes")} error={formState.errors.clinicalNotes?.message}>
          <textarea className="clinic-focus min-h-36 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("clinicalNotes")} />
        </Field>
        <Field label={t("visits.followUpNotes")} error={formState.errors.followUpNotes?.message}>
          <textarea className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("followUpNotes")} />
        </Field>
      </div>
      <div className="flex justify-end gap-2" />
    </ClinicalFormShell>
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
