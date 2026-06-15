import { ArrowRight, CalendarPlus, Pencil, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
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
  const { t } = useTranslation();
  const columns: Array<ColumnDef<PatientSummaryRecord, unknown>> = [
    {
      accessorKey: "name",
      header: t("patients.table.patient"),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
            <UserRound className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.patientCode}</p>
          </div>
        </div>
      )
    },
    {
      accessorKey: "phone",
      header: t("patients.table.phone"),
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.phone}</span>
    },
    {
      accessorKey: "clinic",
      header: t("patients.table.clinic"),
      cell: ({ row }) => <Badge variant="secondary">{row.original.clinic}</Badge>
    },
    {
      accessorKey: "notes",
      header: t("patients.table.notes"),
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.notes ?? t("common.noNotes")}</span>
    },
    {
      id: "actions",
      header: t("patients.table.actions"),
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="soft">
            <Link to={workflowRoutes.patientProfile(row.original.id)}>
              {t("common.actions.open")}
              <ArrowRight className="icon-directional h-4 w-4" />
            </Link>
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
            {t("common.actions.edit")}
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onBook(row.original)}>
            <CalendarPlus className="h-4 w-4" />
            {t("patients.table.book")}
          </Button>
        </div>
      )
    }
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle={t("patients.table.empty")} emptyDescription={t("patients.table.emptyDescription")} />;
}
