import { HONEYPOT_FIELD, signupSchema } from "@domain/signup";
import { describe, expect, it } from "vitest";

const valid = {
  businessName: "Heartbreakers Pizza",
  email: "owner@example.com",
  password: "supersecret",
};

describe("signupSchema", () => {
  it("accepts a valid signup", () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects a blank business name", () => {
    const result = signupSchema.safeParse({ ...valid, businessName: "  " });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = signupSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects a password longer than 50 characters", () => {
    const result = signupSchema.safeParse({ ...valid, password: "a".repeat(51) });
    expect(result.success).toBe(false);
  });

  it("accepts an empty honeypot", () => {
    const result = signupSchema.safeParse({ ...valid, [HONEYPOT_FIELD]: "" });
    expect(result.success).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    const result = signupSchema.safeParse({ ...valid, [HONEYPOT_FIELD]: "a bot was here" });
    expect(result.success).toBe(false);
  });
});
