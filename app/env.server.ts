import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (a Postgres connection string)."),
  SESSION_SECRET: z
    .string()
    .min(1, "SESSION_SECRET is required. Generate one with: openssl rand -base64 32"),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required for transactional email."),
  APP_URL: z.url("APP_URL must be a valid absolute URL, e.g. http://localhost:5173"),
});

export type EnvVariables = z.infer<typeof envSchema>;
export const ENV = envSchema.parse(process.env);
