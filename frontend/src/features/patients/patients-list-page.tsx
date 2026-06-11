import * as React from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatientForm, type PatientFormValues } from "@/features/patients/patient-form";
import { PatientTable } from "@/features/patients/patient-table";
import { useBookAppointment, useCreatePatient, usePatients, useUpdatePatient } from "@/features/patients/patients.api";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";
import type { PatientSummaryRecord } from "@/types/workflow";

export function PatientsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<"name" | "recent" | "code">("name");
  const [editingPatient, setEditingPatient] = React.useState<PatientSummaryRecord | null>(null);
  const [bookingPatient, setBookingPatient] = React.useState<PatientSummaryRecord | null>(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const updatePatient = useUpdatePatient();
  const createPatient = useCreatePatient();
  const bookAppointment = useBookAppointment();
  const { data, isLoading, isError, refetch } = usePatients(search, page, 8, sortBy);

  const handleSavePatient = async (values: PatientFormValues) => {
    if (editingPatient) {
      await updatePatient.mutateAsync({
        patientId: editingPatient.id,
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
      setEditingPatient(null);
      return;
    }

    const patient = await createPatient.mutateAsync({
      name: values.name,
      phone: values.phone,
      clinic: values.clinic,
      email: values.email || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      gender: values.gender || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
      isActive: values.isActive === "true"
    });
    setRegisterOpen(false);
    navigate(workflowRoutes.patientProfile(patient.id));
  };

  const handleBook = async (patient: PatientSummaryRecord) => {
    setBookingPatient(patient);
    await bookAppointment.mutateAsync({
      patientId: patient.id,
      scheduledAt: new Date().toISOString(),
      reason: "Front desk booking",
      notes: "Booked from patient workspace",
      priority: "medium",
      assignedTo: "BOTH"
    });
    navigate(workflowRoutes.appointments);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Patient workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">Search, open, and update patient records</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Search by name, phone, or patient code. Keep quick actions close and avoid long unstructured lists.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="h-4 w-4" />
                  Add patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register patient</DialogTitle>
                  <DialogDescription>Create a patient record with instant validation and grouped fields.</DialogDescription>
                </DialogHeader>
                <PatientForm onSubmit={handleSavePatient} submitLabel="Create patient" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader className="flex-row items-end justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-base">Filter patients</CardTitle>
            <CardDescription>Use the patient code, phone, or name to locate the right record quickly.</CardDescription>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(16rem,24rem)_12rem]">
            <SearchInput value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, phone, or code" aria-label="Search patients" />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "recent" | "code")}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by name</SelectItem>
                <SelectItem value="recent">Sort by recent visit</SelectItem>
                <SelectItem value="code">Sort by patient code</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <WorkflowSkeleton /> : isError ? <WorkflowErrorState title="Patients unavailable" description="The patient list could not be loaded." onRetry={() => void refetch()} /> : data ? data.items.length ? (
            <div className="space-y-4">
              <PatientTable data={data.items} isLoading={false} onEdit={setEditingPatient} onBook={handleBook} />
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          ) : (
            <WorkflowEmptyState
              title="No patients found"
              description="Try another search term or register a new patient."
              actionLabel="Add patient"
              onAction={() => setRegisterOpen(true)}
            />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingPatient)} onOpenChange={(open) => !open && setEditingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit patient</DialogTitle>
            <DialogDescription>Update patient details without creating a new record.</DialogDescription>
          </DialogHeader>
          {editingPatient ? <PatientForm defaultValues={editingPatient} onSubmit={handleSavePatient} submitLabel="Save changes" /> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(bookingPatient)} onOpenChange={(open) => !open && setBookingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking patient</DialogTitle>
            <DialogDescription>Appointment creation is handled through the shared booking flow.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">A new appointment was created and the schedule was refreshed.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
