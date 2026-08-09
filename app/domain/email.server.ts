import { Resend } from "resend";

const FROM = "purpleradish <no-reply@notifications.purpleradish.io>";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "RESEND_API_KEY is not set. Copy .env.example to .env and add a Resend API key.",
    );
  }
  _resend = new Resend(key);
  return _resend;
}

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  const { error } = await getResend().emails.send({
    from: FROM,
    to: [to],
    subject: "Confirm your email for purpleradish",
    text: `Confirm your email to finish setting up purpleradish.\n\n${verifyUrl}\n\nThis link expires in 72 hours. If you did not sign up, you can ignore this email.`,
  });

  if (error) {
    throw new Error(`[email#sendVerificationEmail] Resend rejected the send: ${error.message}`);
  }
}
