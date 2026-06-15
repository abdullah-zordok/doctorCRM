import * as React from "react";
import { Filter, Plus, RefreshCcw, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatientForm, type PatientFormValues } from "@/features/patients/patient-form";
import { PatientTable } from "@/features/patients/patient-table";
import { useBookAppointment, useCreatePatient, usePatients, useUpdatePatient } from "@/features/patients/patients.api";
import { WorkflowEmptyState, WorkflowErrorState, WorkflowSkeleton } from "@/features/shared/workflow-states";
import { workflowRoutes } from "@/routes/workflow-routes";
import type { PatientSummaryRecord } from "@/types/workflow";

export function PatientsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState<"name" | "recent" | "code">("name");
  const [editingPatient, setEditingPatient] = React.useState<PatientSummaryRecord | null>(null);
  const [bookingPatient, setBookingPatient] = React.useState<PatientSummaryRecord | null>(null);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const updatePatient = useUpdatePatient();
  const createPatient = useCreatePatient();
  const bookAppointment = useBookAppointment();
  const { data, isLoading, isError, refetch } = usePatients(search, page, 8, sortBy);

  const handleSavePatient = async (values: PatientFormValues) => {
    if (editingPatient) {
      await updatePatient.mutateAsync({
        patientId: editingPatient.id,
        data: {
          name: values.name,
          phone: values.phone,
          clinic: values.clinic,
          email: values.email || undefined,
          dateOfBirth: values.dateOfBirth || undefined,
          gender: values.gender || undefined,
          address: values.address || undefined,
          notes: values.notes || undefined,
          isActive: values.isActive === "true"
        }
      });
      setEditingPatient(null);
      return;
    }

    const patient = await createPatient.mutateAsync({
      name: values.name,
      phone: values.phone,
      clinic: values.clinic,
      email: values.email || undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      gender: values.gender || undefined,
      address: values.address || undefined,
      notes: values.notes || undefined,
      isActive: values.isActive === "true"
    });
    setRegisterOpen(false);
    navigate(workflowRoutes.patientProfile(patient.id));
  };

  const handleBook = async (patient: PatientSummaryRecord) => {
    setBookingPatient(patient);
    await bookAppointment.mutateAsync({
      patientId: patient.id,
      scheduledAt: new Date().toISOString(),
      reason: "Front desk booking",
      notes: "Booked from patient workspace",
      priority: "medium",
      assignedTo: "BOTH"
    });
    navigate(workflowRoutes.appointments);
  };

  return (
    <div className="clinic-page">
      <section className="clinic-page-header">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="clinic-kicker">{t("patients.kicker")}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{t("patients.title")}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t("patients.description")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              <RefreshCcw className="h-4 w-4" />
              {t("common.actions.retry")}
            </Button>
            <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="h-4 w-4" />
                  {t("patients.add")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("patients.add")}</DialogTitle>
                  <DialogDescription>{t("patients.profileDescription")}</DialogDescription>
                </DialogHeader>
                <PatientForm onSubmit={handleSavePatient} submitLabel={t("patients.create")} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b border-border/60 bg-muted/20 xl:flex-row xl:items-end xl:justify-between xl:space-y-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><Users className="h-4 w-4" /></span>
              <CardTitle className="text-base">{t("patients.title")}</CardTitle>
            </div>
            <CardDescription>{t("patients.description")}</CardDescription>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(16rem,24rem)_12rem]">
            <SearchInput value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder={t("patients.searchPlaceholder")} aria-label={t("patients.searchLabel")} />
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "recent" | "code")}>
              <SelectTrigger>
                <Filter className="h-4 w-4" />
                <SelectValue placeholder={t("patients.sort")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("patients.sortName")}</SelectItem>
                <SelectItem value="recent">{t("patients.sortRecent")}</SelectItem>
                <SelectItem value="code">{t("patients.sortCode")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-5 sm:pt-6">
          {isLoading ? <WorkflowSkeleton /> : isError ? <WorkflowErrorState title={t("patients.unavailable")} description={t("patients.unavailableDescription")} onRetry={() => void refetch()} /> : data ? data.items.length ? (
            <div className="space-y-4">
              <PatientTable data={data.items} isLoading={false} onEdit={setEditingPatient} onBook={handleBook} />
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
            </div>
          ) : (
            <WorkflowEmptyState
              title={t("patients.empty")}
              description={t("patients.emptyDescription")}
              actionLabel={t("patients.add")}
              onAction={() => setRegisterOpen(true)}
            />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(editingPatient)} onOpenChange={(open) => !open && setEditingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("patients.edit")}</DialogTitle>
            <DialogDescription>{t("patients.profileDescription")}</DialogDescription>
          </DialogHeader>
          {editingPatient ? <PatientForm defaultValues={editingPatient} onSubmit={handleSavePatient} submitLabel={t("patients.saveChanges")} /> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(bookingPatient)} onOpenChange={(open) => !open && setBookingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("appointments.book")}</DialogTitle>
            <DialogDescription>{t("appointments.description")}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{t("appointments.savedDescription")}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
