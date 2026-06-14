import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClinicalFormShell } from "@/features/shared/clinical-form-shell";

const visitFormSchema = z.object({
  chiefComplaint: z.string().min(3, "Chief complaint is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  clinicalNotes: z.string().min(5, "Clinical notes are required"),
  followUpNotes: z.string().min(3, "Follow-up notes are required")
});

export type VisitFormValues = z.infer<typeof visitFormSchema>;

type VisitFormProps = {
  defaultValues: VisitFormValues;
  onSave: (values: VisitFormValues) => void;
  onFinish: (values: VisitFormValues) => void;
  saving?: boolean;
  finishing?: boolean;
};

export function VisitForm({ defaultValues, onSave, onFinish, saving, finishing }: VisitFormProps) {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitFormSchema),
    defaultValues
  });

  const { register, handleSubmit, formState } = form;

  return (
    <ClinicalFormShell
      title="Consultation"
      description="Keep the clinical entry, diagnosis, and follow-up notes visible on one page."
      primaryLabel={finishing ? "Finishing..." : "Finish visit"}
      secondaryLabel="Save draft"
      onPrimary={handleSubmit(onFinish)}
      onSecondary={handleSubmit(onSave)}
      primaryDisabled={saving || finishing}
    >
      <div className="space-y-6">
        <div className="grid gap-4 rounded-2xl border bg-muted/20 p-4 sm:grid-cols-3">
          <Field label="Blood pressure">
            <Input placeholder="Not recorded" aria-label="Blood pressure reference" disabled />
          </Field>
          <Field label="Pulse">
            <Input placeholder="Not recorded" aria-label="Pulse reference" disabled />
          </Field>
          <Field label="Temperature">
            <Input placeholder="Not recorded" aria-label="Temperature reference" disabled />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Chief complaint" error={formState.errors.chiefComplaint?.message}>
            <Input {...register("chiefComplaint")} />
          </Field>
          <Field label="Diagnosis" error={formState.errors.diagnosis?.message}>
            <Input {...register("diagnosis")} />
          </Field>
        </div>
        <Field label="Clinical notes" error={formState.errors.clinicalNotes?.message}>
          <textarea className="clinic-focus min-h-36 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("clinicalNotes")} />
        </Field>
        <Field label="Follow-up notes" error={formState.errors.followUpNotes?.message}>
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
