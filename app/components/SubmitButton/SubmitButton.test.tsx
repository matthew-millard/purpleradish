import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SubmitButton } from "./SubmitButton";

describe("SubmitButton", () => {
  it("shows children and hides pendingChildren when idle", () => {
    render(<SubmitButton pendingChildren="Joining…">Join waitlist</SubmitButton>);

    expect(screen.getByText("Join waitlist")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("Joining…")).toHaveAttribute("aria-hidden", "true");
  });

  it("shows pendingChildren when pending is true", () => {
    render(
      <SubmitButton pending pendingChildren="Joining…">
        Join waitlist
      </SubmitButton>,
    );

    expect(screen.getByText("Joining…")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("Join waitlist")).toHaveAttribute("aria-hidden", "true");
  });

  it("pending prop overrides disabled for the visual state", () => {
    render(
      <SubmitButton disabled pending={false} pendingChildren="Joining…">
        Join waitlist
      </SubmitButton>,
    );

    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Join waitlist")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("Joining…")).toHaveAttribute("aria-hidden", "true");
  });

  it("falls back to disabled for the pending visual when pending prop is omitted", () => {
    render(
      <SubmitButton disabled pendingChildren="Joining…">
        Join waitlist
      </SubmitButton>,
    );

    expect(screen.getByText("Joining…")).toHaveAttribute("aria-hidden", "false");
    expect(screen.getByText("Join waitlist")).toHaveAttribute("aria-hidden", "true");
  });
});
