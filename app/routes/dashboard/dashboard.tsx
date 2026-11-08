import { data } from "react-router";
import { logout, requireUserId } from "@auth/session.server";
import { VerificationBanner } from "@components/VerificationBanner/VerificationBanner";
import { findUserById } from "@domain/account.server";
import { resendVerification, type ResendResult } from "@domain/resendVerification.server";
import type { Route } from "./+types/dashboard";
import styles from "./dashboard.module.css";

const RESEND_HTTP_STATUS: Record<ResendResult["status"], number> = {
  sent: 200,
  already_verified: 200,
  limited: 429,
  failed: 502,
  no_user: 401,
};

export function meta(_: Route.MetaArgs) {
  return [{ title: "Dashboard · purpleradish" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await findUserById(userId);
  if (!user) {
    // Stale session for a deleted account. Clear it rather than 500.
    throw await logout(request, "/login");
  }
  return { email: user.email, verified: user.emailVerifiedAt !== null };
}

export async function action({ request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  if (formData.get("intent") !== "resend-verification") {
    return data({ status: "invalid" as const }, { status: 400 });
  }

  const result = await resendVerification(userId);
  if (result.status === "no_user") {
    throw await logout(request, "/login");
  }
  return data(result, { status: RESEND_HTTP_STATUS[result.status] });
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  return (
    <main className={styles.page}>
      {!loaderData.verified && <VerificationBanner email={loaderData.email} />}
      <h1 className={styles.heading}>Dashboard</h1>
    </main>
  );
}
