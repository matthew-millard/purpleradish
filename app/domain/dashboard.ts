import { z } from "zod";

export const RESEND_VERIFICATION_EMAIL_INTENT = "resend-verification";

export const dashboardSchema = z.object({
  intent: z.enum([RESEND_VERIFICATION_EMAIL_INTENT], { error: "Unknown intent." }),
});
