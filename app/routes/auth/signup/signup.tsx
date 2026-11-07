import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, Form, useNavigation } from "react-router";
import { z } from "zod";
import { createUserSession, requireAnonymous } from "@auth/session.server";
import { ENV } from "@env";
import { AuthCard } from "@components/AuthCard/AuthCard";
import { FieldError } from "@components/FieldError/FieldError";
import { FieldLabel } from "@components/FieldLabel/FieldLabel";
import { SubmitButton } from "@components/SubmitButton/SubmitButton";
import { TextInput } from "@components/TextInput/TextInput";
import { createAccount, findUserByEmail } from "@domain/account.server";
import { normalizeEmail } from "@domain/email";
import { sendVerificationEmail } from "@domain/email.server";
import { HONEYPOT_FIELD, signupSchema } from "@domain/signup";
import { checkSignupRateLimit } from "@domain/rateLimit.server";
import { issueVerificationToken } from "@domain/verification.server";
import { useDelayedPending } from "@hooks/useDelayedPending";
import type { Route } from "./+types/signup";
import styles from "./signup.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Sign up · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);
  const formData = await request.formData();

  const { allowed } = await checkSignupRateLimit(request);
  if (!allowed) {
    const submission = parseWithZod(formData, { schema: signupSchema });
    return data(
      submission.reply({ formErrors: ["Too many sign-up attempts. Try again in an hour."] }),
      { status: 429 },
    );
  }

  const submission = await parseWithZod(formData, {
    async: true,
    schema: signupSchema.transform(async (value, ctx) => {
      const existing = await findUserByEmail(normalizeEmail(value.email));
      if (existing) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Email is already in use.",
        });
        return z.NEVER;
      }
      return value;
    }),
  });

  if (submission.status !== "success") {
    return data(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  const { businessName, email, password } = submission.value;
  const normalizedEmail = normalizeEmail(email);
  const { userId } = await createAccount({
    businessName,
    email: normalizedEmail,
    password,
  });

  try {
    const token = await issueVerificationToken(userId);
    const verifyUrl = new URL(`/verify?token=${token}`, ENV.APP_URL).toString();
    await sendVerificationEmail(normalizedEmail, verifyUrl);
  } catch (error) {
    // Sign-up must not fail on a verification-email error: the account and
    // session already exist. Log and continue. TODO: report to Sentry.
    console.error(`[signup#action] verification email failed for user ${userId}:`, error);
  }

  return createUserSession(userId, "/dashboard");
}

export default function Signup({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const submitting = navigation.state !== "idle";
  const pending = useDelayedPending(submitting);

  const [form, fields] = useForm({
    lastResult: actionData,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
    },
  });

  return (
    <AuthCard>
      <h1 className={styles.heading}>Create your account</h1>

      <Form method="post" {...getFormProps(form)} className={styles.form} noValidate>
        <div className={styles.field}>
          <FieldLabel htmlFor={fields.businessName.id}>Business name</FieldLabel>
          <TextInput
            {...getInputProps(fields.businessName, { type: "text" })}
            autoComplete="organization"
            placeholder="Heartbreakers Pizza"
          />
          <FieldError error={fields.businessName.errors?.[0]} />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor={fields.email.id}>Email</FieldLabel>
          <TextInput
            {...getInputProps(fields.email, { type: "email" })}
            autoComplete="email"
            placeholder="you@yourrestaurant.com"
          />
          <FieldError error={fields.email.errors?.[0]} />
        </div>

        <div className={styles.field}>
          <FieldLabel htmlFor={fields.password.id}>Password</FieldLabel>
          <TextInput
            {...getInputProps(fields.password, { type: "password" })}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <FieldError error={fields.password.errors?.[0]} />
        </div>

        <div className="honeypot" aria-hidden="true">
          <label htmlFor={fields[HONEYPOT_FIELD].id}>Company</label>
          <input
            {...getInputProps(fields[HONEYPOT_FIELD], { type: "text" })}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <FieldError error={form.errors?.[0]} />

        <SubmitButton disabled={submitting} pending={pending} pendingChildren="Creating…">
          Create account
        </SubmitButton>
      </Form>
    </AuthCard>
  );
}
