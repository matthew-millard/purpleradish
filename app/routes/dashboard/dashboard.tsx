import { getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { data, useFetcher } from "react-router";
import { requireUserId } from "@auth/session.server";
import { FieldError } from "@components/FieldError/FieldError";
import { dashboardSchema } from "@domain/dashboard";
import { resendVerification } from "@domain/resendVerification.server";
import type { Route } from "./+types/dashboard";
import styles from "./dashboard.module.css";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireUserId(request);
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: dashboardSchema });

  if (submission.status !== "success") {
    return data(submission.reply(), { status: 400 });
  }

  switch (submission.value.intent) {
    case "resend-verification": {
      await resendVerification(userId);
      return submission.reply();
    }
  }
}

export default function Dashboard(_: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>();
  const isPending = fetcher.state !== "idle";

  const [form, fields] = useForm({
    lastResult: fetcher.data,
  });

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Dashboard</h1>
      <fetcher.Form method="post" {...getFormProps(form)}>
        <button type="submit" name="intent" value="resend-verification">
          {isPending ? "Sending" : "Resend verification email"}
        </button>
        <FieldError error={fields.intent.errors?.[0]} />
      </fetcher.Form>
    </main>
  );
}
