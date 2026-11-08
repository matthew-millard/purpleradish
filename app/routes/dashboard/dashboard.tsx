import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, useFetcher } from "react-router";
import { requireUser } from "@auth/session.server";
import { FieldError } from "@components/FieldError/FieldError";
import { isEmailVerified } from "@domain/account";
import { RESEND_VERIFICATION_EMAIL_INTENT, dashboardSchema } from "@domain/dashboard";
import { handleResendVerification } from "@domain/resendVerification.server";
import { useDelayedPending } from "@hooks/useDelayedPending";
import type { Route } from "./+types/dashboard";
import styles from "./dashboard.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  return { emailVerified: isEmailVerified(user) };
}

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: dashboardSchema });

  if (submission.status !== "success") {
    return data(submission.reply(), { status: 400 });
  }

  switch (submission.value.intent) {
    case RESEND_VERIFICATION_EMAIL_INTENT:
      return handleResendVerification({ user, submission });
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { emailVerified } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const sendingVerificationEmail = fetcher.state !== "idle";
  const pending = useDelayedPending(sendingVerificationEmail);
  const verificationEmailSent = !sendingVerificationEmail && fetcher.data?.status === "success";

  const [form, fields] = useForm({
    lastResult: fetcher.data,
  });

  const renderResendVerificationEmailButton = () => {
    if (emailVerified) return null;

    const getLabel = () => {
      if (pending) {
        return "Sending";
      } else if (verificationEmailSent) {
        return "Email sent";
      } else {
        return "Resend verification email";
      }
    };

    return (
      <fetcher.Form method="post" {...getFormProps(form)}>
        <button
          type="submit"
          name="intent"
          value={RESEND_VERIFICATION_EMAIL_INTENT}
          disabled={sendingVerificationEmail || verificationEmailSent}
        >
          {getLabel()}
        </button>
        <FieldError error={fields.intent.errors?.[0] ?? form.errors?.[0]} />
      </fetcher.Form>
    );
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      {renderResendVerificationEmailButton()}
    </main>
  );
}
