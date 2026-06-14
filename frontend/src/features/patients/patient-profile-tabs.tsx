import { CalendarDays, ClipboardList, CreditCard, FileText, HeartPulse, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientTimeline } from "@/features/shared/patient-timeline";
import type { PatientProfile } from "@/types/workflow";

type PatientProfileTabsProps = {
  patient: PatientProfile;
};

export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border bg-card p-2 shadow-sm">
        <TabsTrigger value="basic">Basic info</TabsTrigger>
        <TabsTrigger value="history">Medical history</TabsTrigger>
        <TabsTrigger value="visits">Visits</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic information</CardTitle>
            <CardDescription>Identity and contact details for clinic staff.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProfileField icon={UserRound} label="Patient code" value={patient.patientCode} />
            <ProfileField icon={HeartPulse} label="Phone" value={patient.phone} />
            <ProfileField icon={ClipboardList} label="Clinic" value={patient.clinic} />
            <ProfileField icon={CalendarDays} label="Date of birth" value={patient.dateOfBirth ?? "Not recorded"} />
            <ProfileField icon={FileText} label="Email" value={patient.email ?? "Not recorded"} />
            <ProfileField icon={CreditCard} label="Address" value={patient.address ?? "Not recorded"} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medical history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {patient.medicalHistory.length ? (
              patient.medicalHistory.map((item) => (
                <div key={item} className="rounded-2xl border bg-muted/20 px-4 py-3 text-sm">
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No medical history recorded.</p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {patient.allergies.map((item) => (
                <Badge key={item} variant="warning">
                  Allergy: {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="visits">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.visits.length ? (
              patient.visits.map((visit) => (
                <div key={visit.id} className="rounded-2xl border px-4 py-3">
                  <p className="font-medium">{visit.chiefComplaint}</p>
                  <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No visits yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prescriptions">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prescriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.prescriptions.length ? (
              patient.prescriptions.map((prescription) => (
                <div key={prescription.id} className="rounded-2xl border px-4 py-3">
                  <p className="font-medium">{prescription.printableLabel}</p>
                  <p className="text-sm text-muted-foreground">{prescription.medicines.map((medicine) => medicine.name).join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.appointments.length ? (
              patient.appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                  <div>
                    <p className="font-medium">{appointment.reason}</p>
                    <p className="text-sm text-muted-foreground">{new Date(appointment.scheduledAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={appointment.status === "cancelled" ? "destructive" : appointment.status === "completed" ? "success" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.payments.length ? (
              patient.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.title}</p>
                    <p className="text-sm text-muted-foreground">{new Date(payment.occurredAt).toLocaleString()}</p>
                  </div>
                  <Badge variant={payment.status === "paid" ? "success" : payment.status === "void" ? "destructive" : "warning"}>{payment.amount}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        <PatientTimeline events={patient.timeline} />
      </TabsContent>
    </Tabs>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border bg-muted/20 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
