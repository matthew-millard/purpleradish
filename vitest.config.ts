import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths({ ignoreConfigErrors: true })],
  test: {
    globals: true,
    environment: "jsdom",
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    clearMocks: true,
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.ts", "app/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
});
