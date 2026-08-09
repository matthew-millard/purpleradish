import { z } from "zod";
import { emailSchema } from "@domain/email";

export const HONEYPOT_FIELD = "company";

export const signupSchema = z.object({
  businessName: z
    .string({ error: "Enter your business name." })
    .trim()
    .min(1, { message: "Enter your business name." })
    .max(120, { message: "Business name cannot exceed 120 characters." }),
  email: emailSchema,
  password: z
    .string({ error: "Password must be at least 8 characters." })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(50, { message: "Password cannot exceed 50 characters." }),
  // Honeypot: real users never fill this. Must be empty.
  [HONEYPOT_FIELD]: z.string().max(0).optional(),
});
