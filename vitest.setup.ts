import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

process.env.SESSION_SECRET ??= "test-secret-do-not-use-in-production";
process.env.UPSTASH_REDIS_REST_URL ??= "https://test.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN ??= "test-token";

afterEach(() => {
  cleanup();
});
