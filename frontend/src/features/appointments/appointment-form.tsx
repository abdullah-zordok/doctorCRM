import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function createAppointmentSchema(t: (key: string) => string) {
  return z.object({
    patientId: z.string().min(1, t("validation.choosePatient")),
    scheduledAt: z.string().min(1, t("validation.chooseTime")),
    reason: z.string().min(3, t("validation.reason")),
    notes: z.string().optional().or(z.literal("")),
    priority: z.enum(["urgent", "high", "medium", "low"]),
    assignedTo: z.enum(["DOCTOR", "SECRETARY", "BOTH"])
  });
}

export type AppointmentFormValues = z.infer<ReturnType<typeof createAppointmentSchema>>;

type AppointmentFormProps = {
  onSubmit: (values: AppointmentFormValues) => void;
  defaultValues?: Partial<AppointmentFormValues>;
  submitLabel?: string;
};

export function AppointmentForm({ onSubmit, defaultValues, submitLabel }: AppointmentFormProps) {
  const { t } = useTranslation();
  const appointmentSchema = React.useMemo(() => createAppointmentSchema(t), [t]);
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: defaultValues?.patientId ?? "",
      scheduledAt: defaultValues?.scheduledAt ?? new Date().toISOString().slice(0, 16),
      reason: defaultValues?.reason ?? "",
      notes: defaultValues?.notes ?? "",
      priority: defaultValues?.priority ?? "medium",
      assignedTo: defaultValues?.assignedTo ?? "BOTH"
    }
  });

  const { register, handleSubmit, formState, setValue, watch } = form;

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="clinic-kicker">{t("appointments.kicker")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("appointments.description")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("appointments.form.patientId")} error={formState.errors.patientId?.message}>
          <Input {...register("patientId")} placeholder="pat-001" />
        </Field>
        <Field label={t("appointments.form.scheduledAt")} error={formState.errors.scheduledAt?.message}>
          <Input type="datetime-local" {...register("scheduledAt")} />
        </Field>
        <div className="md:col-span-2">
          <Field label={t("appointments.form.reason")} error={formState.errors.reason?.message}>
            <Input {...register("reason")} placeholder={t("appointments.form.reasonPlaceholder")} />
          </Field>
        </div>
      </div>
      <Field label={t("appointments.form.notes")} error={formState.errors.notes?.message}>
        <textarea className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("notes")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t("appointments.form.priority")} error={formState.errors.priority?.message}>
          <Select value={watch("priority")} onValueChange={(value) => setValue("priority", value as AppointmentFormValues["priority"], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder={t("appointments.form.priority")} />
            </SelectTrigger>
            <SelectContent>
              {(["urgent", "high", "medium", "low"] as const).map((priority) => <SelectItem key={priority} value={priority}>{t(`common.priority.${priority}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("appointments.form.assignedTo")} error={formState.errors.assignedTo?.message}>
          <Select value={watch("assignedTo")} onValueChange={(value) => setValue("assignedTo", value as AppointmentFormValues["assignedTo"], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder={t("appointments.form.role")} />
            </SelectTrigger>
            <SelectContent>
              {(["DOCTOR", "SECRETARY", "BOTH"] as const).map((role) => <SelectItem key={role} value={role}>{t(`common.roles.${role}`)}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg">{submitLabel ?? t("appointments.save")}</Button>
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
