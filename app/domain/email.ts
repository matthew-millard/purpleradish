import { z } from "zod";

export const emailSchema = z
  .email({ message: "Invalid email address." })
  .max(254, { message: "Email address cannot exceed 254 characters." });

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
