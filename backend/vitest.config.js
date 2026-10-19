import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // Test-only settings. These never touch your real .env or your dev database.
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://test:test@localhost:5432/nyumbalink_test",
    },
  },
});
