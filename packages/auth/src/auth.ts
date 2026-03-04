import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { resend } from "@repo/mail/resend";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.VITE_BASE_URL;
const trustedOrigins = baseURL ? baseURL.split(",") : [];

export const auth = betterAuth({
  baseURL,
  trustedOrigins,
  secret: process.env.SERVER_AUTH_SECRET,
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

  socialProviders: {
    github: {
      clientId: process.env.SERVER_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.SERVER_GITHUB_CLIENT_SECRET as string,
    },
    google: {
      enabled: true,
      clientId: process.env.SERVER_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.SERVER_GOOGLE_CLIENT_SECRET as string,
    },
  },

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    sendResetPassword: async ({ user, token }) => {
      const url = `${baseURL}/reset-password?token=${token}&username=${user.name}&callbackURL=/app`;

      await resend.emails.send({
        from: process.env.SERVER_MAIL_FROM ?? "reset@urmomlovme.fr",
        to: user.email,
        subject: "TANSTARTER - Reset your password",
        html: `<p>Reset your password by clicking <a href="${url}">here</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${baseURL}/verify-email?token=${token}&username=${user.name}&callbackURL=/app?emailVerified=true`;

      await resend.emails.send({
        from: process.env.SERVER_MAIL_FROM ?? "verify@urmomlovme.fr",
        to: user.email,
        subject: "TANSTARTER - Verify your email",
        html: `<p>Verify your email by clicking <a href="${url}">here</a></p>`,
      });
    },
  },

  experimental: {
    // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },
});
