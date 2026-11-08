import { eq } from "drizzle-orm";
import { db } from "@db/client";
import { memberships, organizations, users } from "@db/schema";
import { hashPassword, verifyPassword } from "@domain/password";

// A pre-computed bcrypt hash used when the email is unknown, so an unknown
// email costs the same time as a known one. Prevents a timing side-channel
// that would otherwise leak which addresses have accounts.
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO3jN0F2b3q5g5aQZ5o5cQ5oq5o5cQ5o5";

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export type User = Pick<typeof users.$inferSelect, "id" | "email" | "emailVerifiedAt">;

export async function findUserById(id: string): Promise<User | null> {
  const [user] = await db
    .select({ id: users.id, email: users.email, emailVerifiedAt: users.emailVerifiedAt })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<{ userId: string } | null> {
  const user = await findUserByEmail(email);
  const matches = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !matches) {
    return null;
  }
  return { userId: user.id };
}

export async function createAccount(input: {
  businessName: string;
  email: string;
  password: string;
}): Promise<{ userId: string }> {
  const passwordHash = await hashPassword(input.password);

  return db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ email: input.email, passwordHash })
      .returning({ id: users.id });
    const [org] = await tx
      .insert(organizations)
      .values({ businessName: input.businessName })
      .returning({ id: organizations.id });
    await tx.insert(memberships).values({ userId: user.id, organizationId: org.id, role: "owner" });

    return { userId: user.id };
  });
}
