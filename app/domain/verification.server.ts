import { randomBytes, createHash } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@db/client";
import { emailVerificationTokens, users } from "@db/schema";

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 72; // 72 hours

export function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function issueVerificationToken(userId: string): Promise<string> {
  const token = generateToken();
  await db.insert(emailVerificationTokens).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });
  return token;
}

export type VerificationResult =
  | { status: "verified" }
  | { status: "invalid" }
  | { status: "expired" }
  | { status: "already_consumed" };

export async function consumeVerificationToken(token: string): Promise<VerificationResult> {
  const [row] = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.tokenHash, hashToken(token)))
    .limit(1);

  if (!row) {
    return { status: "invalid" };
  }
  if (row.consumedAt) {
    return { status: "already_consumed" };
  }
  if (row.expiresAt.getTime() <= Date.now()) {
    return { status: "expired" };
  }

  const consumed = await db.transaction(async (tx) => {
    const now = new Date();
    const updated = await tx
      .update(emailVerificationTokens)
      .set({ consumedAt: now })
      .where(
        and(eq(emailVerificationTokens.id, row.id), isNull(emailVerificationTokens.consumedAt)),
      )
      .returning({ id: emailVerificationTokens.id });

    if (updated.length === 0) {
      return false;
    }

    await tx
      .update(users)
      .set({ emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, row.userId));
    return true;
  });

  return consumed ? { status: "verified" } : { status: "already_consumed" };
}
