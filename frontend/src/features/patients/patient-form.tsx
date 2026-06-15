import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PatientRecord } from "@/types/workflow";

function createPatientFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("validation.patientName")),
    phone: z.string().min(6, t("validation.phone")),
    clinic: z.string().min(2, t("validation.clinic")),
    email: z.string().email(t("validation.email")).optional().or(z.literal("")),
    dateOfBirth: z.string().optional().or(z.literal("")),
    gender: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    isActive: z.enum(["true", "false"])
  });
}

export type PatientFormValues = z.infer<ReturnType<typeof createPatientFormSchema>>;

type PatientFormProps = {
  defaultValues?: Partial<PatientRecord>;
  onSubmit: (values: PatientFormValues) => void;
  submitLabel?: string;
};

export function PatientForm({ defaultValues, onSubmit, submitLabel }: PatientFormProps) {
  const { t } = useTranslation();
  const patientFormSchema = React.useMemo(() => createPatientFormSchema(t), [t]);
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phone: defaultValues?.phone ?? "",
      clinic: defaultValues?.clinic ?? "",
      email: defaultValues?.email ?? "",
      dateOfBirth: defaultValues?.dateOfBirth ?? "",
      gender: defaultValues?.gender ?? "",
      address: defaultValues?.address ?? "",
      notes: defaultValues?.notes ?? "",
      isActive: defaultValues?.isActive === false ? "false" : "true"
    }
  });

  const { register, handleSubmit, formState, setValue, watch } = form;
  const isActive = watch("isActive");

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="clinic-kicker">{t("patients.profileKicker")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("patients.profileDescription")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("patients.form.name")} error={formState.errors.name?.message}>
          <Input {...register("name")} placeholder={t("patients.form.name")} />
        </Field>
        <Field label={t("patients.form.phone")} error={formState.errors.phone?.message}>
          <Input {...register("phone")} placeholder="+966..." />
        </Field>
        <Field label={t("patients.form.clinic")} error={formState.errors.clinic?.message}>
          <Input {...register("clinic")} placeholder={t("patients.form.generalMedicine")} />
        </Field>
        <Field label={t("patients.form.email")} error={formState.errors.email?.message}>
          <Input {...register("email")} placeholder="patient@example.com" />
        </Field>
        <Field label={t("patients.form.dateOfBirth")} error={formState.errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} />
        </Field>
        <Field label={t("patients.form.gender")} error={formState.errors.gender?.message}>
          <Input {...register("gender")} placeholder={t("patients.form.female")} />
        </Field>
      </div>

      <div className="grid gap-4 rounded-2xl border bg-muted/20 p-4 md:grid-cols-2">
        <Field label={t("patients.form.address")} error={formState.errors.address?.message}>
          <Input {...register("address")} placeholder={t("patients.form.addressPlaceholder")} />
        </Field>
        <Field label={t("patients.form.activeRecord")} error={formState.errors.isActive?.message}>
          <Select value={isActive} onValueChange={(value) => setValue("isActive", value as "true" | "false", { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder={t("patients.form.activeStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">{t("common.active")}</SelectItem>
              <SelectItem value="false">{t("common.inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field label={t("patients.form.notes")} error={formState.errors.notes?.message}>
            <textarea
              className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm"
              {...register("notes")}
              placeholder={t("patients.form.notesPlaceholder")}
            />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">{submitLabel ?? t("common.actions.save")}</Button>
      </div>
    </form>
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
