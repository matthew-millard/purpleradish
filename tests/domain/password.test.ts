import { hashPassword, verifyPassword } from "@domain/password";
import { describe, expect, it } from "vitest";

describe("password hashing", () => {
  it("hashes a password to a bcrypt string that is not the plaintext", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).not.toBe("correct horse battery staple");
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it("verifies a correct password against its hash", async () => {
    const hash = await hashPassword("s3cret-pw");
    expect(await verifyPassword("s3cret-pw", hash)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("s3cret-pw");
    expect(await verifyPassword("wrong-pw", hash)).toBe(false);
  });
});
