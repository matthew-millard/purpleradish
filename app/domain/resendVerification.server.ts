import { isEmailVerified } from "@domain/account";
import type { User } from "@domain/account.server";
import { sendVerificationEmail } from "@domain/email.server";
import { buildVerifyUrl, reissueVerificationToken } from "@domain/verification.server";

export type ResendResult = "sent" | "already_verified";

export async function resendVerification(user: User): Promise<ResendResult> {
  if (isEmailVerified(user)) {
    return "already_verified";
  }

  const token = await reissueVerificationToken(user.id);
  await sendVerificationEmail(user.email, buildVerifyUrl(token));
  return "sent";
}
