import { createUserSession, getUserId, logout, requireUserId } from "@auth/session.server";
import { describe, expect, it } from "vitest";

function requestWithCookie(setCookie: string): Request {
  const cookie = setCookie.split(";")[0];
  return new Request("http://localhost/dashboard", { headers: { Cookie: cookie } });
}

describe("session helpers", () => {
  it("creates a session cookie and reads the user id back", async () => {
    const response = await createUserSession("user-123", "/dashboard");
    const setCookie = response.headers.get("Set-Cookie");
    expect(setCookie).toBeTruthy();
    expect(response.headers.get("Location")).toBe("/dashboard");

    const userId = await getUserId(requestWithCookie(setCookie!));
    expect(userId).toBe("user-123");
  });

  it("returns null when no session cookie is present", async () => {
    const userId = await getUserId(new Request("http://localhost/dashboard"));
    expect(userId).toBeNull();
  });

  it("requireUserId returns the id when a session exists", async () => {
    const response = await createUserSession("user-abc", "/dashboard");
    const setCookie = response.headers.get("Set-Cookie")!;
    const userId = await requireUserId(requestWithCookie(setCookie));
    expect(userId).toBe("user-abc");
  });

  it("requireUserId redirects to login with redirectTo when absent", async () => {
    const request = new Request("http://localhost/dashboard");
    try {
      await requireUserId(request);
      expect.unreachable("requireUserId should have thrown a redirect");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(Response);
      const response = thrown as Response;
      expect(response.status).toBe(302);
      const location = response.headers.get("Location")!;
      expect(location).toContain("/login");
      expect(location).toContain("redirectTo=%2Fdashboard");
    }
  });

  it("logout clears the session so the id no longer reads back", async () => {
    const created = await createUserSession("user-xyz", "/dashboard");
    const setCookie = created.headers.get("Set-Cookie")!;

    const loggedOut = await logout(requestWithCookie(setCookie));
    const clearedCookie = loggedOut.headers.get("Set-Cookie");
    expect(clearedCookie).toBeTruthy();

    const userId = await getUserId(requestWithCookie(clearedCookie!));
    expect(userId).toBeNull();
  });
});
