import { Badge } from "@/components/ui/badge";
import { getStatusVariant } from "@/features/shared/workflow-status";
import type { WorkflowStatus } from "@/types/workflow";
import { Circle, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type StatusChipProps = {
  status: WorkflowStatus;
  className?: string;
};

export function StatusChip({ status, className }: StatusChipProps) {
  const { t } = useTranslation();
  const Icon = status === "completed" || status === "issued" ? CheckCircle2 : status === "cancelled" ? XCircle : status === "waiting" || status === "open" ? Clock3 : Circle;

  return (
    <Badge variant={getStatusVariant(status)} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {t(`common.status.${status}`)}
    </Badge>
  );
}
