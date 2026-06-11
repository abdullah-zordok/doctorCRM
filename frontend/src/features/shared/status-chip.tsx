import { Badge } from "@/components/ui/badge";
import { getStatusLabel, getStatusVariant } from "@/features/shared/workflow-status";
import type { WorkflowStatus } from "@/types/workflow";

type StatusChipProps = {
  status: WorkflowStatus;
  className?: string;
};

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <Badge variant={getStatusVariant(status)} className={className}>
      {getStatusLabel(status)}
    </Badge>
  );
}
