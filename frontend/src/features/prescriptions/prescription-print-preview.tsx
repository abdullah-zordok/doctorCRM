import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrescriptionRecord } from "@/types/workflow";

type PrescriptionPrintPreviewProps = {
  prescription: PrescriptionRecord | null;
  visitLabel: string;
};

export function PrescriptionPrintPreview({ prescription, visitLabel }: PrescriptionPrintPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Print preview</CardTitle>
        <CardDescription>Printable summary based on the stored prescription details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prescription ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{prescription.patientName}</p>
                <p className="text-lg font-semibold">{visitLabel}</p>
              </div>
              <Badge variant="success">{prescription.printableLabel}</Badge>
            </div>
            <div className="space-y-3">
              {prescription.medicines.map((medicine) => (
                <div key={medicine.id} className="rounded-md border p-3">
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
                  <p className="text-sm text-muted-foreground">{medicine.duration}</p>
                  {medicine.notes ? <p className="text-sm text-muted-foreground">{medicine.notes}</p> : null}
                </div>
              ))}
            </div>
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-sm font-medium">Instructions</p>
              <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Save the prescription to generate the printable output.</p>
        )}
      </CardContent>
    </Card>
  );
}
