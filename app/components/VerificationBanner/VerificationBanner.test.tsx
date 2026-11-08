import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerificationBannerView } from "./VerificationBanner";

const EMAIL = "owner@example.com";

type Props = Parameters<typeof VerificationBannerView>[0];

function renderView(overrides: Partial<Props> = {}) {
  return render(
    <VerificationBannerView
      email={EMAIL}
      status={undefined}
      submitting={false}
      pending={false}
      Form="form"
      {...overrides}
    />,
  );
}

describe("VerificationBannerView", () => {
  it("names the address and offers a resend before any attempt", () => {
    renderView();

    expect(screen.getByRole("status")).toHaveTextContent(
      `We sent a link to ${EMAIL} to verify your account. Until then, some parts of the app remain locked.`,
    );
    expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument();
  });

  it("submits the resend intent", () => {
    const { container } = renderView();

    const intent = container.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(intent.value).toBe("resend-verification");
    expect(container.querySelector("form")).toHaveAttribute("method", "post");
  });

  it("shows the pending label and disables the button while sending", () => {
    renderView({ submitting: true, pending: true });

    const button = screen.getByRole("button", { name: "Sending" });
    expect(button).toBeDisabled();
  });

  it("confirms the send and drops the button", () => {
    renderView({ status: "sent" });

    expect(screen.getByRole("status")).toHaveTextContent(
      `A fresh link is on its way to ${EMAIL}. It works for 72 hours.`,
    );
    expect(screen.getByText("link sent")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("explains the limit and hides the button when rate limited", () => {
    renderView({ status: "limited" });

    expect(screen.getByText(/asked for a few links recently/)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps the button when sending fails", () => {
    renderView({ status: "failed" });

    expect(screen.getByText(/couldn't send the email/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resend link" })).toBeInTheDocument();
  });
});
