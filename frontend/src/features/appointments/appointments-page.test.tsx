import { fetchAppointments, updateAppointmentStatus } from "@/features/shared/workflow-api";

export async function verifyAppointmentWorkspaceScenario() {
  const schedule = await fetchAppointments({ page: 1, pageSize: 8, status: "all" });
  const first = schedule.items[0];
  const updated = first ? await updateAppointmentStatus(first.id, "waiting") : null;

  return {
    waitingItemsArePrioritized: schedule.items[0]?.status === "waiting",
    completedOrCancelledRemainVisible: schedule.items.some((item) => item.status === "completed" || item.status === "cancelled"),
    statusCanBeUpdated: updated?.status === "waiting"
  };
}
