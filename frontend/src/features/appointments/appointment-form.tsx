import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Choose a patient"),
  scheduledAt: z.string().min(1, "Choose a time"),
  reason: z.string().min(3, "Reason is required"),
  notes: z.string().optional().or(z.literal("")),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  assignedTo: z.enum(["DOCTOR", "SECRETARY", "BOTH"])
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

type AppointmentFormProps = {
  onSubmit: (values: AppointmentFormValues) => void;
  defaultValues?: Partial<AppointmentFormValues>;
  submitLabel?: string;
};

export function AppointmentForm({ onSubmit, defaultValues, submitLabel = "Save appointment" }: AppointmentFormProps) {
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
        <p className="clinic-kicker">Appointment details</p>
        <p className="mt-1 text-sm text-muted-foreground">Schedule the patient and assign the right clinic priority.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Patient ID" error={formState.errors.patientId?.message}>
          <Input {...register("patientId")} placeholder="pat-001" />
        </Field>
        <Field label="Scheduled at" error={formState.errors.scheduledAt?.message}>
          <Input type="datetime-local" {...register("scheduledAt")} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Reason" error={formState.errors.reason?.message}>
            <Input {...register("reason")} placeholder="Follow-up visit" />
          </Field>
        </div>
      </div>
      <Field label="Notes" error={formState.errors.notes?.message}>
        <textarea className="clinic-focus min-h-24 w-full rounded-xl border border-input bg-background/90 px-3.5 py-3 text-sm shadow-sm" {...register("notes")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Priority" error={formState.errors.priority?.message}>
          <Select value={watch("priority")} onValueChange={(value) => setValue("priority", value as AppointmentFormValues["priority"], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Assigned to" error={formState.errors.assignedTo?.message}>
          <Select value={watch("assignedTo")} onValueChange={(value) => setValue("assignedTo", value as AppointmentFormValues["assignedTo"], { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DOCTOR">Doctor</SelectItem>
              <SelectItem value="SECRETARY">Secretary</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="lg">{submitLabel}</Button>
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
