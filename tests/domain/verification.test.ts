import { generateToken, hashToken } from "@domain/verification.server";
import { describe, expect, it } from "vitest";

describe("verification token helpers", () => {
  it("generates a url-safe token with no padding", () => {
    const token = generateToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("generates a unique token each call", () => {
    expect(generateToken()).not.toBe(generateToken());
  });

  it("hashes deterministically", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
  });

  it("produces different hashes for different tokens", () => {
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });

  it("never stores the raw token in its hash", () => {
    const token = generateToken();
    expect(hashToken(token)).not.toContain(token);
  });
});
