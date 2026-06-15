import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, FileText, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { StatusChip } from "@/features/shared/status-chip";
import { workflowRoutes } from "@/routes/workflow-routes";
import { formatDateTime } from "@/i18n/format";
import type { PatientProfile, PrescriptionRecord, VisitRecord } from "@/types/workflow";

type PatientContextPanelProps = {
  patient: PatientProfile;
  visit: VisitRecord;
  prescription?: PrescriptionRecord | null;
};

export function PatientContextPanel({ patient, visit, prescription }: PatientContextPanelProps) {
  const { t, i18n } = useTranslation();
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/60 bg-muted/20">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <UserRound className="h-5 w-5" />
            </span>
            <div>
            <CardTitle className="text-base">{patient.name}</CardTitle>
            <CardDescription>
              {patient.patientCode} - {patient.clinic}
            </CardDescription>
            </div>
          </div>
          <StatusChip status={visit.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoRow icon={Phone} label={t("visits.phone")} value={patient.phone} />
          <InfoRow icon={ClipboardList} label={t("visits.chiefComplaint")} value={visit.chiefComplaint} />
          <InfoRow icon={CalendarDays} label={t("visits.visitTime")} value={formatDateTime(visit.visitDate, i18n.resolvedLanguage ?? i18n.language)} />
          <InfoRow icon={UserRound} label={t("visits.doctor")} value={visit.doctorName} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="soft" size="sm">
            <Link to={workflowRoutes.patientProfile(patient.id)}>{t("common.actions.open")} {t("patients.profileKicker")}</Link>
          </Button>
          <Button asChild variant="soft" size="sm">
            <Link to={workflowRoutes.prescriptionBuilder(visit.id)}>
              <FileText className="h-4 w-4" />
              {t("prescriptions.title")}
            </Link>
          </Button>
          {prescription ? <Badge variant="success">{prescription.printableLabelKey ? t(prescription.printableLabelKey) : prescription.printableLabel}</Badge> : <Badge variant="secondary">{t("visits.noPrescription")}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
