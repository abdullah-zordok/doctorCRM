import { CalendarCheck2, CalendarX2, Clock3, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/features/shared/status-chip";
import { sortAppointmentsByPriority } from "@/features/shared/workflow-status";
import type { AppointmentRecord } from "@/types/workflow";

type AppointmentTableProps = {
  data: AppointmentRecord[];
  isLoading?: boolean;
  onStatusChange: (appointment: AppointmentRecord, status: AppointmentRecord["status"]) => void;
  onEdit: (appointment: AppointmentRecord) => void;
};

export function AppointmentTable({ data, onStatusChange, onEdit }: AppointmentTableProps) {
  const rows = sortAppointmentsByPriority(data);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Today's appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((appointment) => (
          <div key={appointment.id} className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{appointment.patientName}</h3>
                  <StatusChip status={appointment.status} />
                  <Badge variant={appointment.priority === "urgent" ? "warning" : "secondary"}>{appointment.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.patientCode} - {new Date(appointment.scheduledAt).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{appointment.notes}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onEdit(appointment)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onStatusChange(appointment, "waiting")}>
                  <Clock3 className="h-4 w-4" />
                  Waiting
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onStatusChange(appointment, "completed")}>
                  <CalendarCheck2 className="h-4 w-4" />
                  Complete
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onStatusChange(appointment, "cancelled")}>
                  <CalendarX2 className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
