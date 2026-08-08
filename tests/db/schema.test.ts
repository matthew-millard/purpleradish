import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it } from "vitest";
import { memberships, organizations, users } from "@db/schema";
import { createTestDb, type TestDb } from "@tests/helpers/testDb";

describe("account schema", () => {
  let db: TestDb;

  beforeAll(async () => {
    db = await createTestDb();
  });

  it("creates a user, organization, and owner membership", async () => {
    const [user] = await db
      .insert(users)
      .values({ email: "owner@example.com", passwordHash: "hash" })
      .returning();
    const [org] = await db
      .insert(organizations)
      .values({ businessName: "Heartbreakers Pizza" })
      .returning();
    const [membership] = await db
      .insert(memberships)
      .values({ userId: user.id, organizationId: org.id, role: "owner" })
      .returning();

    expect(user.emailVerifiedAt).toBeNull();
    expect(membership.role).toBe("owner");

    const rows = await db.select().from(memberships).where(eq(memberships.userId, user.id));
    expect(rows).toHaveLength(1);
  });

  it("enforces unique email on users", async () => {
    await db.insert(users).values({ email: "dupe@example.com", passwordHash: "h" });
    await expect(
      db.insert(users).values({ email: "dupe@example.com", passwordHash: "h" }),
    ).rejects.toThrow();
  });

  it("enforces the memberships (user_id, organization_id) unique constraint", async () => {
    const [user] = await db
      .insert(users)
      .values({ email: "member@example.com", passwordHash: "h" })
      .returning();
    const [org] = await db.insert(organizations).values({ businessName: "Acme" }).returning();

    await db.insert(memberships).values({ userId: user.id, organizationId: org.id, role: "owner" });
    await expect(
      db.insert(memberships).values({ userId: user.id, organizationId: org.id, role: "manager" }),
    ).rejects.toThrow();
  });
});
