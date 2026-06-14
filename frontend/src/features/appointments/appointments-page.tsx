import * as React from "react";
import { CalendarDays, CalendarPlus, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="clinic-kicker">Appointment management</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Today&apos;s schedule</h1>
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
                <CalendarPlus className="h-4 w-4" />
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

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Today's total", value: data?.total ?? 0, icon: CalendarDays },
          { label: "Waiting", value: data?.items.filter((item) => item.status === "waiting").length ?? 0, icon: Clock3 },
          { label: "Completed", value: data?.items.filter((item) => item.status === "completed").length ?? 0, icon: CheckCircle2 },
          { label: "Cancelled", value: data?.items.filter((item) => item.status === "cancelled").length ?? 0, icon: XCircle }
        ].map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex-row items-start justify-between space-y-0 pb-3">
              <div><CardDescription>{metric.label}</CardDescription><CardTitle className="mt-2 text-3xl">{metric.value}</CardTitle></div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><metric.icon className="h-4 w-4" /></span>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b border-border/60 bg-muted/20 xl:flex-row xl:items-end xl:justify-between xl:space-y-0">
          <div>
            <CardTitle className="text-base">Schedule filters</CardTitle>
            <CardDescription className="mt-1">Keep waiting patients visible while reviewing every appointment state.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "waiting", "scheduled", "completed", "cancelled"] as const).map((option) => (
              <Button key={option} type="button" variant={status === option ? "default" : "outline"} size="sm" onClick={() => { setStatus(option); setPage(1); }}>
                {option}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-5 sm:pt-6">
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
