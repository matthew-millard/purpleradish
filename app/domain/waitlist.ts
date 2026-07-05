export type WaitlistInput = {
  email: string;
};

export type WaitlistValidation = { ok: true; value: WaitlistInput } | { ok: false; error: string };

// Deliberately loose: real validation is the confirmation email, not a regex.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

export function validateWaitlistInput(form: FormData): WaitlistValidation {
  const raw = form.get("email");

  if (typeof raw !== "string" || raw.trim() === "") {
    return { ok: false, error: "Enter your email address." };
  }

  const email = raw.trim().toLowerCase();

  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "That doesn't look like a valid email address." };
  }

  return { ok: true, value: { email } };
}
