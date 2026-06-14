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
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <CardTitle className="text-base">Timeline</CardTitle>
        <CardDescription>Visit, prescription, appointment, and note history in chronological order.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length ? (
          <div className="relative space-y-4 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-border">
            {events.map((event) => {
              const Icon = icons[event.type];
              return (
                <div key={event.id} className="relative flex gap-3 rounded-2xl border bg-card p-4">
                  <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-4 ring-card">
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
                  <Badge variant="outline" className="hidden shrink-0 sm:inline-flex">
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
