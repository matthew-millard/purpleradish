import { findUserById } from "@domain/account.server";
import { sendVerificationEmail } from "@domain/email.server";
import { checkResendRateLimit } from "@domain/rateLimit.server";
import { reissueVerificationToken } from "@domain/verification.server";
import { ENV } from "@env";

export type ResendResult = {
  status: "sent" | "already_verified" | "limited" | "failed" | "no_user";
};

export async function resendVerification(userId: string): Promise<ResendResult> {
  const user = await findUserById(userId);
  if (!user) {
    return { status: "no_user" };
  }
  if (user.emailVerifiedAt) {
    return { status: "already_verified" };
  }

  const { allowed } = await checkResendRateLimit(user.email);
  if (!allowed) {
    return { status: "limited" };
  }

  try {
    const token = await reissueVerificationToken(userId);
    const verifyUrl = new URL(`/verify?token=${token}`, ENV.APP_URL).toString();
    await sendVerificationEmail(user.email, verifyUrl);
    return { status: "sent" };
  } catch (error) {
    console.error(`[resendVerification] failed for user ${userId}:`, error);
    return { status: "failed" };
  }
}
