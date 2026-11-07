import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import { VerifyStatus } from "./VerifyStatus";

type Props = Parameters<typeof VerifyStatus>[0];

function renderVerifyStatus(props: Props) {
  const Stub = createRoutesStub([
    { path: "/verify", Component: () => <VerifyStatus {...props} /> },
  ]);
  return render(<Stub initialEntries={["/verify"]} />);
}

describe("VerifyStatus", () => {
  it.each([
    ["verified", "You're all set", "email verified"],
    ["already_consumed", "Already confirmed", "link already used"],
    ["expired", "This link has expired", "link expired"],
    ["invalid", "We couldn't verify that link", "invalid link"],
  ] as const)("renders the %s state", (status, heading, label) => {
    renderVerifyStatus({ status, authenticated: true });

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(heading);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("points to the dashboard when the visitor is logged in", () => {
    renderVerifyStatus({ status: "verified", authenticated: true });

    expect(screen.getByRole("link", { name: "Go to dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });

  it("points to login when the visitor has no session", () => {
    renderVerifyStatus({ status: "expired", authenticated: false });

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login");
  });

  it("renders exactly one call to action", () => {
    renderVerifyStatus({ status: "invalid", authenticated: false });

    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});
