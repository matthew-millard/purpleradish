import { findUserById } from "@domain/account.server";
import { sendVerificationEmail } from "@domain/email.server";
import { buildVerifyUrl, reissueVerificationToken } from "@domain/verification.server";

export async function resendVerification(userId: string): Promise<void> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error(`[resendVerification] no user for id ${userId}`);
  }

  const token = await reissueVerificationToken(userId);
  await sendVerificationEmail(user.email, buildVerifyUrl(token));
}
