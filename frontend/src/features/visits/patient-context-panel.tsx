import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, FileText, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusChip } from "@/features/shared/status-chip";
import { workflowRoutes } from "@/routes/workflow-routes";
import type { PatientProfile, PrescriptionRecord, VisitRecord } from "@/types/workflow";

type PatientContextPanelProps = {
  patient: PatientProfile;
  visit: VisitRecord;
  prescription?: PrescriptionRecord | null;
};

export function PatientContextPanel({ patient, visit, prescription }: PatientContextPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{patient.name}</CardTitle>
            <CardDescription>
              {patient.patientCode} - {patient.clinic}
            </CardDescription>
          </div>
          <StatusChip status={visit.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={ClipboardList} label="Chief complaint" value={visit.chiefComplaint} />
          <InfoRow icon={CalendarDays} label="Visit time" value={new Date(visit.visitDate).toLocaleString()} />
          <InfoRow icon={UserRound} label="Doctor" value={visit.doctorName} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={workflowRoutes.patientProfile(patient.id)}>Open patient profile</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={workflowRoutes.prescriptionBuilder(visit.id)}>
              <FileText className="h-4 w-4" />
              Prescription builder
            </Link>
          </Button>
          {prescription ? <Badge variant="success">{prescription.printableLabel}</Badge> : <Badge variant="secondary">No prescription yet</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-2 text-sm font-medium">{value}</p>
    </div>
  );
}
