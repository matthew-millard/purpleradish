import { getClientIp } from "@domain/rateLimit.server";
import { describe, expect, it } from "vitest";

function requestWith(headers: Record<string, string>): Request {
  return new Request("http://localhost/signup", { method: "POST", headers });
}

describe("getClientIp", () => {
  it("prefers Fly-Client-IP", () => {
    const request = requestWith({
      "Fly-Client-IP": "203.0.113.7",
      "X-Forwarded-For": "198.51.100.1",
    });
    expect(getClientIp(request)).toBe("203.0.113.7");
  });

  it("falls back to the first X-Forwarded-For hop", () => {
    const request = requestWith({ "X-Forwarded-For": "198.51.100.1, 10.0.0.1" });
    expect(getClientIp(request)).toBe("198.51.100.1");
  });

  it("returns 'unknown' when no client headers are present", () => {
    expect(getClientIp(requestWith({}))).toBe("unknown");
  });
});
