import { z } from "zod";

export const dashboardSchema = z.object({
  intent: z.enum(["resend-verification"], { error: "Unknown intent." }),
});
