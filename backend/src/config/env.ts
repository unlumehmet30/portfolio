import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const optionalEnvString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional()
);

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email().optional()
);

const trustProxySetting = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();

  if (!normalized || normalized === "false") {
    return false;
  }

  if (normalized === "true") {
    return true;
  }

  const parsed = Number(normalized);
  if (Number.isInteger(parsed) && parsed >= 0) {
    return parsed;
  }

  return value;
}, z.union([z.boolean(), z.number().int().nonnegative()]).default(false));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().default("file:./dev.db"),
  PORT: z.coerce.number().default(8080),
  TRUST_PROXY: trustProxySetting,
  CORS_ORIGIN: z.string().default("http://localhost:3001"),
  CONTACT_NOTIFICATION_EMAIL: optionalEmail,
  CONTACT_EMAIL_FROM: z
    .preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().trim().default("Mehmet Portfolio <onboarding@resend.dev>")
    ),
  RESEND_API_KEY: optionalEnvString,
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  CONTACT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(6),
  ADMIN_LOGIN_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(15),
  ADMIN_LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(6),
  ADMIN_API_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().int().positive().default(5),
  ADMIN_API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(180),
  CONTACT_MIN_FILL_SECONDS: z.coerce.number().int().positive().default(2),
  CONTACT_REMINDER_DAYS: z.coerce.number().int().positive().default(7),
  CONTACT_REMINDER_INTERVAL_MINUTES: z.coerce.number().int().positive().default(60),
  UPLOADS_DIR: z.string().trim().default("uploads"),
  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_PASSWORD: z.string().default("change-this-password"),
  ADMIN_SESSION_SECRET: z.string().default("change-this-session-secret")
});

export const env = envSchema.parse(process.env);
