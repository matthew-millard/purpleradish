import { z } from "zod";

export type WaitlistInput = {
  email: string;
};

export type WaitlistValidation = { ok: true; value: WaitlistInput } | { ok: false; error: string };

const emailSchema = z
  .email({ message: "Invalid email address format." })
  .max(254, { message: "Email address cannot exceed 254 characters." });

export function validateWaitlistInput(formData: FormData): WaitlistValidation {
  const raw = formData.get("email");

  if (typeof raw !== "string" || raw.trim() === "") {
    return { ok: false, error: "Enter your email address." };
  }

  const result = emailSchema.safeParse(raw);

  if (!result.success) {
    return { ok: false, error: result.error.issues[0].message };
  }

  return { ok: true, value: { email: result.data } };
}
