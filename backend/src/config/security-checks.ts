import { env } from "./env.js";

export function runStartupSecurityChecks() {
  if (env.NODE_ENV !== "production") {
    return;
  }

  const errors: string[] = [];
  const warnings: string[] = [];
  const corsOrigins = env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean);

  if (env.ADMIN_PASSWORD === "change-this-password" || env.ADMIN_PASSWORD.length < 12) {
    errors.push("ADMIN_PASSWORD must be changed and at least 12 characters in production.");
  }

  if (
    env.ADMIN_SESSION_SECRET === "change-this-session-secret" ||
    env.ADMIN_SESSION_SECRET.length < 32
  ) {
    errors.push("ADMIN_SESSION_SECRET must be changed and at least 32 characters in production.");
  }

  if (corsOrigins.some((origin) => !origin.startsWith("https://"))) {
    errors.push("CORS_ORIGIN must only contain https origins in production.");
  }

  if (env.TRUST_PROXY === true) {
    errors.push("TRUST_PROXY must be a specific proxy count in production, such as 1.");
  }

  if (env.CONTACT_EMAIL_FROM.includes("onboarding@resend.dev")) {
    warnings.push("CONTACT_EMAIL_FROM uses onboarding@resend.dev. Use a verified domain sender in production.");
  }

  if (!env.RESEND_API_KEY) {
    warnings.push("RESEND_API_KEY is empty. Contact emails and reminders will be skipped.");
  }

  if (warnings.length) {
    for (const warning of warnings) {
      console.warn(`[security warning] ${warning}`);
    }
  }

  if (errors.length) {
    throw new Error(`[security checks failed] ${errors.join(" ")}`);
  }
}
