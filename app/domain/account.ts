import type { User } from "@domain/account.server";

export function isEmailVerified(user: Pick<User, "emailVerifiedAt">): boolean {
  return user.emailVerifiedAt !== null;
}
