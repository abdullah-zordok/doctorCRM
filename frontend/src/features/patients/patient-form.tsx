import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PatientRecord } from "@/types/workflow";

const patientFormSchema = z.object({
  name: z.string().min(2, "Patient name is required"),
  phone: z.string().min(6, "Phone number is required"),
  clinic: z.string().min(2, "Clinic is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  isActive: z.enum(["true", "false"])
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

type PatientFormProps = {
  defaultValues?: Partial<PatientRecord>;
  onSubmit: (values: PatientFormValues) => void;
  submitLabel?: string;
};

export function PatientForm({ defaultValues, onSubmit, submitLabel = "Save patient" }: PatientFormProps) {
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
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Patient name" error={formState.errors.name?.message}>
          <Input {...register("name")} placeholder="Patient name" />
        </Field>
        <Field label="Phone number" error={formState.errors.phone?.message}>
          <Input {...register("phone")} placeholder="+966..." />
        </Field>
        <Field label="Clinic" error={formState.errors.clinic?.message}>
          <Input {...register("clinic")} placeholder="General Medicine" />
        </Field>
        <Field label="Email" error={formState.errors.email?.message}>
          <Input {...register("email")} placeholder="patient@example.com" />
        </Field>
        <Field label="Date of birth" error={formState.errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} />
        </Field>
        <Field label="Gender" error={formState.errors.gender?.message}>
          <Input {...register("gender")} placeholder="Female" />
        </Field>
      </div>

      <Field label="Address" error={formState.errors.address?.message}>
        <Input {...register("address")} placeholder="Riyadh..." />
      </Field>

      <Field label="Notes" error={formState.errors.notes?.message}>
        <textarea
          className="clinic-focus min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          {...register("notes")}
          placeholder="Quick clinical or reception notes"
        />
      </Field>

      <Field label="Active record" error={formState.errors.isActive?.message}>
        <Select value={isActive} onValueChange={(value) => setValue("isActive", value as "true" | "false", { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Active status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <div className="flex justify-end">
        <Button type="submit">{submitLabel}</Button>
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
