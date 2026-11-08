import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { emailVerificationTokens, users } from "@db/schema";

// Swap the Neon connection for an in-process PGlite so the real Drizzle
// queries in verification.server run against a real Postgres.
vi.mock("@db/client", async () => {
  const { createTestDb } = await import("@tests/helpers/testDb");
  return { db: await createTestDb() };
});

const { db } = await import("@db/client");
const { consumeVerificationToken, issueVerificationToken, reissueVerificationToken } =
  await import("@domain/verification.server");

describe("reissueVerificationToken", () => {
  let userId: string;

  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ email: "owner@example.com", passwordHash: "hash" })
      .returning();
    userId = user.id;
  });

  it("expires outstanding tokens and issues a working replacement", async () => {
    const first = await issueVerificationToken(userId);
    const second = await reissueVerificationToken(userId);

    expect(second).not.toBe(first);
    expect(await consumeVerificationToken(first)).toEqual({ status: "expired" });
    expect(await consumeVerificationToken(second)).toEqual({ status: "verified" });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    expect(user.emailVerifiedAt).not.toBeNull();
  });

  it("leaves consumed tokens untouched", async () => {
    const [user] = await db
      .insert(users)
      .values({ email: "second@example.com", passwordHash: "hash" })
      .returning();
    const consumed = await issueVerificationToken(user.id);
    await consumeVerificationToken(consumed);

    await reissueVerificationToken(user.id);

    const rows = await db
      .select()
      .from(emailVerificationTokens)
      .where(eq(emailVerificationTokens.userId, user.id));
    const consumedRow = rows.find((r) => r.consumedAt !== null);
    expect(consumedRow).toBeDefined();
    expect(consumedRow!.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });
});
