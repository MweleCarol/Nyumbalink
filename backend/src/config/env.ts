import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.string().startsWith("postgresql://", "must start with postgresql://"),
  CORS_ORIGINS: z.string().default(""),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  // Print only which variables are wrong and why. Never print their values.
  console.error("Invalid environment configuration:");
  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;
