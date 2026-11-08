import type { ElementType, ReactNode } from "react";
import { useFetcher } from "react-router";
import { SubmitButton } from "@components/SubmitButton/SubmitButton";
import type { ResendResult } from "@domain/resendVerification.server";
import { useDelayedPending } from "@hooks/useDelayedPending";
import styles from "./VerificationBanner.module.css";

type ResendStatus = ResendResult["status"];

interface ViewProps {
  /** Address the verification link was sent to. */
  email: string;
  /** Outcome of the last resend, or undefined before the first attempt. */
  status: ResendStatus | undefined;
  /** True while a resend request is in flight. */
  submitting: boolean;
  /** Delayed pending flag that drives the button's label swap. */
  pending: boolean;
  /** Form element to submit through, normally `fetcher.Form`. */
  Form: ElementType;
}

const VerificationBannerView = ({ email, status, submitting, pending, Form }: ViewProps) => {
  const address = <span className="pr-data">{email}</span>;

  let message: ReactNode;
  if (status === "sent") {
    message = (
      <>
        A fresh link is on its way to {address}. It works for{" "}
        <span className="pr-data">72 hours</span>.
      </>
    );
  } else if (status === "limited") {
    message =
      "You've asked for a few links recently. Check your inbox and spam folder, and try again in an hour.";
  } else if (status === "failed") {
    message = "We couldn't send the email just now. Try again in a moment.";
  } else {
    message = (
      <>
        We sent a link to {address} to verify your account. Until then, some parts of the app remain
        locked.
      </>
    );
  }

  const showButton = status !== "sent" && status !== "limited";

  return (
    <section className={styles.banner} role="status" aria-live="polite">
      <p className={styles.message}>{message}</p>
      <div className={styles.action}>
        {showButton ? (
          <Form method="post">
            <input type="hidden" name="intent" value="resend-verification" />
            <SubmitButton pending={pending} disabled={submitting} pendingChildren="Sending">
              Resend link
            </SubmitButton>
          </Form>
        ) : status === "sent" ? (
          <>
            <span className="pr-dot pr-dot--live" aria-hidden="true" />
            <span className="pr-label">link sent</span>
          </>
        ) : null}
      </div>
    </section>
  );
};

interface Props {
  email: string;
}

const VerificationBanner = ({ email }: Props) => {
  const fetcher = useFetcher<ResendResult>();
  const submitting = fetcher.state !== "idle";
  const pending = useDelayedPending(submitting);

  return (
    <VerificationBannerView
      email={email}
      status={submitting ? undefined : fetcher.data?.status}
      submitting={submitting}
      pending={pending}
      Form={fetcher.Form}
    />
  );
};

export { VerificationBanner, VerificationBannerView };
