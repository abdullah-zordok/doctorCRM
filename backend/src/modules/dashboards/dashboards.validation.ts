import { z } from "zod";
import { dateRangeQuerySchema, optionalTrimmedString } from "../../lib/admin-validation";

export const dashboardQuerySchema = dateRangeQuerySchema.extend({
  clinicId: optionalTrimmedString(255)
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
