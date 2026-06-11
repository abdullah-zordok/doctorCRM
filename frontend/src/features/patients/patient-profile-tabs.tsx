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
      <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
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
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ProfileField label="Patient code" value={patient.patientCode} />
            <ProfileField label="Phone" value={patient.phone} />
            <ProfileField label="Clinic" value={patient.clinic} />
            <ProfileField label="Date of birth" value={patient.dateOfBirth ?? "Not recorded"} />
            <ProfileField label="Email" value={patient.email ?? "Not recorded"} />
            <ProfileField label="Address" value={patient.address ?? "Not recorded"} />
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
                <div key={item} className="rounded-md border px-3 py-2 text-sm">
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
                <div key={visit.id} className="rounded-md border px-3 py-2">
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
                <div key={prescription.id} className="rounded-md border px-3 py-2">
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
                <div key={appointment.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
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
                <div key={payment.id} className="flex items-center justify-between rounded-md border px-3 py-2">
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

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
