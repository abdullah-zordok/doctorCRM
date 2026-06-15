import { CalendarDays, ClipboardList, CreditCard, FileText, HeartPulse, UserRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { PatientTimeline } from "@/features/shared/patient-timeline";
import { formatDateTime } from "@/i18n/format";
import type { PatientProfile } from "@/types/workflow";

type PatientProfileTabsProps = {
  patient: PatientProfile;
};

export function PatientProfileTabs({ patient }: PatientProfileTabsProps) {
  const { t, i18n } = useTranslation();
  return (
    <Tabs defaultValue="basic">
      <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border bg-card p-2 shadow-sm">
        <TabsTrigger value="basic">{t("patients.tabs.overview")}</TabsTrigger>
        <TabsTrigger value="history">{t("patients.tabs.history")}</TabsTrigger>
        <TabsTrigger value="visits">{t("patients.tabs.visits")}</TabsTrigger>
        <TabsTrigger value="prescriptions">{t("patients.tabs.prescriptions")}</TabsTrigger>
        <TabsTrigger value="appointments">{t("patients.tabs.appointments")}</TabsTrigger>
        <TabsTrigger value="payments">{t("patients.tabs.payments")}</TabsTrigger>
        <TabsTrigger value="timeline">{t("patients.timeline")}</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.overview")}</CardTitle>
            <CardDescription>{t("patients.profileDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProfileField icon={UserRound} label={t("patients.fields.patientCode")} value={patient.patientCode} />
            <ProfileField icon={HeartPulse} label={t("patients.fields.phone")} value={patient.phone} />
            <ProfileField icon={ClipboardList} label={t("patients.fields.clinic")} value={patient.clinic} />
            <ProfileField icon={CalendarDays} label={t("patients.fields.dateOfBirth")} value={patient.dateOfBirth ?? t("common.notRecorded")} />
            <ProfileField icon={FileText} label={t("patients.fields.email")} value={patient.email ?? t("common.notRecorded")} />
            <ProfileField icon={CreditCard} label={t("patients.fields.address")} value={patient.address ?? t("common.notRecorded")} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.history")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {patient.medicalHistory.length ? (
              patient.medicalHistory.map((item) => (
                <div key={item} className="rounded-2xl border bg-muted/20 px-4 py-3 text-sm">
                  {item}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("patients.noHistory")}</p>
            )}
            <div className="flex flex-wrap gap-2 pt-2">
              {patient.allergies.map((item) => (
                <Badge key={item} variant="warning">
                  {t("patients.allergy", { item })}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="visits">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.visits")}</CardTitle>
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
              <p className="text-sm text-muted-foreground">{t("patients.noVisits")}</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="prescriptions">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.prescriptions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.prescriptions.length ? (
              patient.prescriptions.map((prescription) => (
                <div key={prescription.id} className="rounded-2xl border px-4 py-3">
                  <p className="font-medium">{prescription.printableLabelKey ? t(prescription.printableLabelKey) : prescription.printableLabel}</p>
                  <p className="text-sm text-muted-foreground">{prescription.medicines.map((medicine) => medicine.name).join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("patients.noPrescriptions")}</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.appointments")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.appointments.length ? (
              patient.appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3">
                  <div>
                    <p className="font-medium">{appointment.reason}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(appointment.scheduledAt, i18n.resolvedLanguage ?? i18n.language)}</p>
                  </div>
                  <Badge variant={appointment.status === "cancelled" ? "destructive" : appointment.status === "completed" ? "success" : "secondary"}>
                    {t(`common.status.${appointment.status}`)}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("patients.noAppointments")}</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("patients.tabs.payments")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patient.payments.length ? (
              patient.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                  <div>
                    <p className="font-medium">{payment.titleKey ? t(payment.titleKey) : payment.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDateTime(payment.occurredAt, i18n.resolvedLanguage ?? i18n.language)}</p>
                  </div>
                  <Badge variant={payment.status === "paid" ? "success" : payment.status === "void" ? "destructive" : "warning"}>{payment.amount}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("patients.noPayments")}</p>
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
