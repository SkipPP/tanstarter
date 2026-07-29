import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { resend } from "@repo/mail/resend";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { getOAuthProviders, requireEnv, requireHttpUrl } from "./env";

const env = requireEnv(["VITE_BASE_URL", "SERVER_AUTH_SECRET", "SERVER_MAIL_FROM"]);
const baseURL = requireHttpUrl("VITE_BASE_URL", env.VITE_BASE_URL);
const socialProviders = getOAuthProviders();
const escapeHtmlAttribute = (value: string) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

export const auth = betterAuth({
  baseURL,
  secret: env.SERVER_AUTH_SECRET,
  trustedOrigins: [baseURL],
  rateLimit: {
    enabled: true,
    storage: "memory",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 10 },
      "/sign-up/email": { window: 60, max: 5 },
      "/forget-password": { window: 60, max: 3 },
      "/request-password-reset": { window: 60, max: 3 },
      "/reset-password": { window: 60, max: 5 },
      "/send-verification-email": { window: 60, max: 3 },
      "/verify-email": { window: 60, max: 10 },
    },
  },
  telemetry: {
    enabled: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  plugins: [tanstackStartCookies()],

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  socialProviders,

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: env.SERVER_MAIL_FROM,
        to: user.email,
        subject: "TANSTARTER - Reset your password",
        html: `<p>Reset your password by clicking <a href="${escapeHtmlAttribute(url)}">here</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.SERVER_MAIL_FROM,
        to: user.email,
        subject: "TANSTARTER - Verify your email",
        html: `<p>Verify your email by clicking <a href="${escapeHtmlAttribute(url)}">here</a></p>`,
      });
    },
  },

  experimental: {
    // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },
});
