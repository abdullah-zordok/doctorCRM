import { ArrowRight, CalendarPlus, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import type { PatientSummaryRecord } from "@/types/workflow";
import { workflowRoutes } from "@/routes/workflow-routes";

type PatientTableProps = {
  data: PatientSummaryRecord[];
  isLoading?: boolean;
  onEdit: (patient: PatientSummaryRecord) => void;
  onBook: (patient: PatientSummaryRecord) => void;
};

export function PatientTable({ data, isLoading, onEdit, onBook }: PatientTableProps) {
  const columns: Array<ColumnDef<PatientSummaryRecord, unknown>> = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => (
        <div>
          <p className="font-semibold">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.patientCode}</p>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone}</span>
    },
    {
      accessorKey: "clinic",
      header: "Clinic",
      cell: ({ row }) => <Badge variant="secondary">{row.original.clinic}</Badge>
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.notes ?? "No notes"}</span>
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={workflowRoutes.patientProfile(row.original.id)}>
              Open
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onBook(row.original)}>
            <CalendarPlus className="h-4 w-4" />
            Book
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle="No patients found" emptyDescription="Try a different name, phone number, or patient code." />
      </CardContent>
    </Card>
  );
}
