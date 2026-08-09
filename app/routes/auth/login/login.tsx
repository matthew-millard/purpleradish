import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, Form, useNavigation } from "react-router";
import { createUserSession, requireAnonymous } from "@auth/session.server";
import { AuthCard } from "@components/AuthCard/AuthCard";
import { FieldError } from "@components/FieldError/FieldError";
import { FieldLabel } from "@components/FieldLabel/FieldLabel";
import { SubmitButton } from "@components/SubmitButton/SubmitButton";
import { TextInput } from "@components/TextInput/TextInput";
import { verifyCredentials } from "@domain/account.server";
import { normalizeEmail } from "@domain/email";
import { loginSchema } from "@domain/login";
import { useDelayedPending } from "~/hooks/useDelayedPending";
import type { Route } from "./+types/login";
import styles from "./login.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Log in · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: loginSchema });

  if (submission.status !== "success") {
    return data(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  const { email, password } = submission.value;
  const credentials = await verifyCredentials(normalizeEmail(email), password);

  if (!credentials) {
    return data(submission.reply({ formErrors: ["Invalid email or password."] }), { status: 400 });
  }

  const redirectTo = new URL(request.url).searchParams.get("redirectTo");
  return createUserSession(credentials.userId, safeRedirect(redirectTo));
}

function safeRedirect(to: string | null): string {
  if (to && to.startsWith("/") && !to.startsWith("//")) {
    return to;
  }
  return "/dashboard";
}

export default function Login({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const submitting = navigation.state !== "idle";
  const pending = useDelayedPending(submitting);

  const [form, fields] = useForm({
    lastResult: actionData,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
  });

  return (
    <AuthCard>
      <h1 className={styles.heading}>Log in</h1>

      <Form method="post" {...getFormProps(form)} className={styles.form} noValidate>
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
            autoComplete="current-password"
          />
          <FieldError error={fields.password.errors?.[0]} />
        </div>

        <FieldError error={form.errors?.[0]} />

        <SubmitButton disabled={submitting} pending={pending} pendingChildren="Logging in…">
          Log in
        </SubmitButton>
      </Form>
    </AuthCard>
  );
}
