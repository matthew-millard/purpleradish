import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

process.env.DATABASE_URL ??= "postgres://test:test@localhost:5432/test";
process.env.SESSION_SECRET ??= "test-secret-do-not-use-in-production";
process.env.RESEND_API_KEY ??= "re_test";
process.env.APP_URL ??= "http://localhost:5173";
process.env.UPSTASH_REDIS_REST_URL ??= "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN ??= "test-token";

afterEach(() => {
  cleanup();
});
