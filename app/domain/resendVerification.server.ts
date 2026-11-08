import type { Submission } from "@conform-to/react";
import { data } from "react-router";
import type { z } from "zod";
import { isEmailVerified } from "@domain/account";
import type { User } from "@domain/account.server";
import type { dashboardSchema } from "@domain/dashboard";
import { sendVerificationEmail } from "@domain/email.server";
import { checkResendVerificationRateLimit } from "@domain/rateLimit.server";
import { buildVerifyUrl, reissueVerificationToken } from "@domain/verification.server";

type ResendResult = "sent" | "already_verified";

async function resendVerification(user: User): Promise<ResendResult> {
  if (isEmailVerified(user)) {
    return "already_verified";
  }

  const token = await reissueVerificationToken(user.id);
  await sendVerificationEmail(user.email, buildVerifyUrl(token));
  return "sent";
}

export async function handleResendVerification({
  user,
  submission,
}: {
  user: User;
  submission: Submission<z.infer<typeof dashboardSchema>>;
}) {
  const { allowed } = await checkResendVerificationRateLimit(user.id);
  if (!allowed) {
    return data(
      submission.reply({
        formErrors: ["You've asked for a few links recently. Try again in an hour."],
      }),
      { status: 429 },
    );
  }

  const result = await resendVerification(user);
  if (result === "already_verified") {
    return data(submission.reply({ formErrors: ["Your email is already verified."] }), {
      status: 400,
    });
  }

  return submission.reply();
}
