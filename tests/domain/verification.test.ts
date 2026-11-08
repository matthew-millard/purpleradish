import { eq } from "drizzle-orm";
import { describe, expect, it, vi } from "vitest";
import { users } from "@db/schema";
import { db } from "@db/client";
import {
  consumeVerificationToken,
  generateToken,
  hashToken,
  issueVerificationToken,
  reissueVerificationToken,
} from "@domain/verification.server";

// Point the real Drizzle queries at an in-process PGlite instead of Neon.
vi.mock("@db/client", async () => {
  const { createTestDb } = await import("@tests/helpers/testDb");
  return { db: await createTestDb() };
});

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

describe("reissueVerificationToken", () => {
  it("expires the outstanding token and issues a working replacement", async () => {
    const [user] = await db
      .insert(users)
      .values({ email: "owner@example.com", passwordHash: "hash" })
      .returning();

    const original = await issueVerificationToken(user.id);
    const replacement = await reissueVerificationToken(user.id);

    expect(await consumeVerificationToken(original)).toEqual({ status: "expired" });
    expect(await consumeVerificationToken(replacement)).toEqual({ status: "verified" });

    const [verified] = await db.select().from(users).where(eq(users.id, user.id));
    expect(verified.emailVerifiedAt).not.toBeNull();
  });
});
