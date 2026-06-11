import * as React from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import { AppointmentForm, type AppointmentFormValues } from "@/features/appointments/appointment-form";
import { AppointmentTable } from "@/features/appointments/appointment-table";
import { useAppointments, useCreateAppointment, useUpdateAppointment, useUpdateAppointmentStatus } from "@/features/appointments/appointments.api";
import { useNotifications } from "@/features/notifications/notifications-provider";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";

export function AppointmentsPage() {
  const { notify } = useNotifications();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<"all" | "waiting" | "scheduled" | "completed" | "cancelled" | "no_show">("all");
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = React.useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentFormValues | null>(null);
  const { data, isLoading, isError, refetch } = useAppointments(search, page, 8, status);
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  const handleCreateAppointment = async (values: AppointmentFormValues) => {
    const data = {
      patientId: values.patientId,
      scheduledAt: new Date(values.scheduledAt).toISOString(),
      reason: values.reason,
      notes: values.notes ?? "",
      priority: values.priority,
      assignedTo: values.assignedTo
    };

    if (selectedAppointmentId) {
      await updateAppointment.mutateAsync({ appointmentId: selectedAppointmentId, data });
    } else {
      await createAppointment.mutateAsync(data);
    }

    setEditOpen(false);
    setSelectedAppointmentId(null);
    setSelectedAppointment(null);
    notify({ type: "success", title: selectedAppointmentId ? "Appointment updated" : "Appointment booked", description: "The schedule and dashboard queue have been updated." });
  };

  const handleStatusChange = async (appointment: { id: string; status: "waiting" | "scheduled" | "completed" | "cancelled" | "no_show" }, nextStatus: "waiting" | "scheduled" | "completed" | "cancelled" | "no_show") => {
    await updateStatus.mutateAsync({ appointmentId: appointment.id, status: nextStatus });
    notify({ type: "info", title: "Appointment updated", description: `Appointment marked as ${nextStatus}.` });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-card p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Appointment management</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">Today's schedule with queue priority</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Waiting patients stay above completed items, while cancelled appointments remain visible but distinct.</p>
          </div>
          <Dialog
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (!open) {
                setSelectedAppointmentId(null);
                setSelectedAppointment(null);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button type="button">
                <Plus className="h-4 w-4" />
                Book appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book appointment</DialogTitle>
                <DialogDescription>Create or reschedule an appointment with smart defaults and validation.</DialogDescription>
              </DialogHeader>
              <AppointmentForm onSubmit={handleCreateAppointment} submitLabel="Save appointment" defaultValues={selectedAppointment ?? undefined} />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Card>
        <CardHeader className="flex-row items-end justify-between gap-4 space-y-0">
          <CardTitle className="text-base">Filter appointments</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "waiting", "scheduled", "completed", "cancelled"] as const).map((option) => (
              <Button key={option} type="button" variant={status === option ? "default" : "outline"} size="sm" onClick={() => { setStatus(option); setPage(1); }}>
                {option}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <SearchInput value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search appointment, patient, or reason" aria-label="Search appointments" />
        </CardContent>
      </Card>

      {isLoading ? <WorkflowSkeleton /> : isError ? <WorkflowErrorState title="Appointments unavailable" description="The schedule could not be loaded." onRetry={() => void refetch()} /> : data ? data.items.length ? (
        <div className="space-y-4">
          <AppointmentTable
            data={data.items}
            onEdit={(appointment) => {
              setSelectedAppointmentId(appointment.id);
              setSelectedAppointment({
                patientId: appointment.patientId,
                scheduledAt: appointment.scheduledAt.slice(0, 16),
                reason: appointment.reason,
                notes: appointment.notes,
                priority: appointment.priority,
                assignedTo: appointment.assignedTo
              });
              setEditOpen(true);
            }}
            onStatusChange={handleStatusChange}
          />
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      ) : (
        <WorkflowEmptyState title="No appointments found" description="Try a different search or create a new appointment." actionLabel="Book appointment" onAction={() => setEditOpen(true)} />
      ) : null}
    </div>
  );
}
