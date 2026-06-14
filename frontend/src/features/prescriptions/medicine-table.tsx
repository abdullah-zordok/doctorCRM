import * as React from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import type { FieldArrayWithId, UseFormRegister, UseFieldArrayAppend, UseFieldArrayRemove, FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type MedicineRow = {
  name: string;
  dosage: string;
  duration: string;
  notes: string;
};

type MedicineTableProps = {
  fields: FieldArrayWithId<{ medicines: MedicineRow[] }, "medicines", "id">[];
  register: UseFormRegister<{ medicines: MedicineRow[]; instructions: string; notes: string }>;
  errors: FieldErrors<{ medicines: MedicineRow[]; instructions: string; notes: string }>;
  append: UseFieldArrayAppend<{ medicines: MedicineRow[]; instructions: string; notes: string }, "medicines">;
  remove: UseFieldArrayRemove;
};

export function MedicineTable({ fields, register, errors, append, remove }: MedicineTableProps) {
  const [medicineName, setMedicineName] = React.useState("");

  function addSearchedMedicine() {
    const name = medicineName.trim();
    if (!name) {
      return;
    }
    append({ name, dosage: "", duration: "", notes: "" });
    setMedicineName("");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Medicines</h3>
          <p className="text-sm text-muted-foreground">Add multiple rows with dosage, duration, and notes.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => append({ name: "", dosage: "", duration: "", notes: "" })}>
          <Plus className="h-4 w-4" />
          Add medicine
        </Button>
      </div>

      <div className="flex gap-2 rounded-2xl border bg-muted/20 p-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={medicineName}
            onChange={(event) => setMedicineName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSearchedMedicine();
              }
            }}
            className="pl-10"
            placeholder="Search or type a medicine name"
          />
        </div>
        <Button type="button" variant="soft" onClick={addSearchedMedicine}>Add</Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 gap-4 md:grid-cols-2">
                <Field label="Medicine name" error={errors.medicines?.[index]?.name?.message as string | undefined}>
                  <Input {...register(`medicines.${index}.name`)} placeholder="Medicine" />
                </Field>
                <Field label="Dosage" error={errors.medicines?.[index]?.dosage?.message as string | undefined}>
                  <Input {...register(`medicines.${index}.dosage`)} placeholder="500mg twice daily" />
                </Field>
                <Field label="Duration" error={errors.medicines?.[index]?.duration?.message as string | undefined}>
                  <Input {...register(`medicines.${index}.duration`)} placeholder="30 days" />
                </Field>
                <Field label="Notes" error={errors.medicines?.[index]?.notes?.message as string | undefined}>
                  <Input {...register(`medicines.${index}.notes`)} placeholder="Take with meals" />
                </Field>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove medicine</span>
              </Button>
            </div>
          </div>
        ))}
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
