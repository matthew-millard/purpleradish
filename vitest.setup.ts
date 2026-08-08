import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

process.env.SESSION_SECRET ??= "test-secret-do-not-use-in-production";

afterEach(() => {
  cleanup();
});
