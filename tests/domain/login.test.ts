import { loginSchema } from "@domain/login";
import { describe, expect, it } from "vitest";

const valid = {
  email: "owner@example.com",
  password: "supersecret",
};

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a short password (no policy leak on login)", () => {
    const result = loginSchema.safeParse({ ...valid, password: "x" });
    expect(result.success).toBe(true);
  });
});
