import { Resend } from "resend";

const FROM = "purpleradish <no-reply@notifications.purpleradish.io>";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: "Confirm your email for purpleradish",
    text: `Confirm your email to finish setting up purpleradish.\n\n${verifyUrl}\n\nThis link expires in 72 hours. If you did not sign up, you can ignore this email.`,
  });

  if (error) {
    throw new Error(`[email#sendVerificationEmail] Resend rejected the send: ${error.message}`);
  }
}
