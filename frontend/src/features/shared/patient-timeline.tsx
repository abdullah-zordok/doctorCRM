import { CalendarClock, FileText, NotebookText, Stethoscope, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusChip } from "@/features/shared/status-chip";
import type { PatientTimelineEvent } from "@/types/workflow";

const icons = {
  visit: Stethoscope,
  appointment: CalendarClock,
  prescription: FileText,
  note: NotebookText,
  payment: WalletCards
} as const;

type PatientTimelineProps = {
  events: PatientTimelineEvent[];
};

export function PatientTimeline({ events }: PatientTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Timeline</CardTitle>
        <CardDescription>Visit, prescription, appointment, and note history in chronological order.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length ? (
          <div className="space-y-4">
            {events.map((event) => {
              const Icon = icons[event.type];
              return (
                <div key={event.id} className="flex gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <StatusChip status={event.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{new Date(event.occurredAt).toLocaleString()}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {event.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No timeline events yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
