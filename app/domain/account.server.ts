import { eq } from "drizzle-orm";
import { getDb } from "@db/client";
import { memberships, organizations, users } from "@db/schema";
import { hashPassword } from "@domain/password";

export async function findUserByEmail(email: string) {
  const [user] = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function createAccount(input: {
  businessName: string;
  email: string;
  password: string;
}): Promise<{ userId: string }> {
  const passwordHash = await hashPassword(input.password);

  return getDb().transaction(async (tx) => {
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
