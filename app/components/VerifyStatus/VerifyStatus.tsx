import type { ReactNode } from "react";
import { LinkButton } from "@components/LinkButton/LinkButton";
import type { VerificationResult } from "@domain/verification.server";
import { cx } from "@lib/cx";
import styles from "./VerifyStatus.module.css";

type Status = VerificationResult["status"];

interface Props {
  status: Status;
  /** Whether the visitor has a live session. Decides where the next step points. */
  authenticated: boolean;
}

interface StateCopy {
  /** Lowercase tracked label shown beside the dot. */
  label: string;
  /** Dot colour carries the meaning: green done, magenta needs you, red error. */
  dot: "live" | "attention" | "danger";
  heading: string;
  body: ReactNode;
}

const COPY: Record<Status, StateCopy> = {
  verified: {
    label: "email verified",
    dot: "live",
    heading: "You're all set",
    body: "Your email is confirmed. You can close this tab or head back to your dashboard.",
  },
  already_consumed: {
    label: "link already used",
    dot: "live",
    heading: "Already confirmed",
    body: "This link has already been used and your email is verified. Nothing more to do here.",
  },
  expired: {
    label: "link expired",
    dot: "attention",
    heading: "This link has expired",
    body: (
      <>
        Verification links last <span className="pr-data">72 hours</span>. You can request a fresh
        one from your dashboard.
      </>
    ),
  },
  invalid: {
    label: "invalid link",
    dot: "danger",
    heading: "We couldn't verify that link",
    body: "The link may be incomplete or out of date. Open the email and try it again, or request a new one from your dashboard.",
  },
};

const VerifyStatus = ({ status, authenticated }: Props) => {
  const copy = COPY[status];

  return (
    <div className={styles.status}>
      <p className={styles.signal}>
        <span className={cx("pr-dot", `pr-dot--${copy.dot}`)} aria-hidden="true" />
        <span className="pr-label">{copy.label}</span>
      </p>
      <h1 className={styles.heading}>{copy.heading}</h1>
      <p className={styles.body}>{copy.body}</p>
      {authenticated ? (
        <LinkButton to="/dashboard">Go to dashboard</LinkButton>
      ) : (
        <LinkButton to="/login">Log in</LinkButton>
      )}
    </div>
  );
};

export { VerifyStatus };
