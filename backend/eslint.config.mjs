import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "node_modules/**",
      "eslint.config.mjs",
      "vitest.config.mts",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Express error handlers must declare four parameters even if some go unused.
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    // Supertest response bodies are untyped, so these rules would only add noise in tests.
    files: ["tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  prettier,
);
