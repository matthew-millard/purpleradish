import { z } from "zod";
import { emailSchema } from "@domain/email";

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: "Enter your password." }).min(1, { message: "Enter your password." }),
});
