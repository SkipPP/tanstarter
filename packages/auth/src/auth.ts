import "@tanstack/react-start/server-only";

import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";

import { db } from "@repo/db";
import * as schema from "@repo/db/schema";

import { resend } from "@repo/mail/resend";

export const auth = betterAuth({
  baseURL: process.env.VITE_BASE_URL,
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

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    sendResetPassword: async ({ user, token }) => {
      const url = `${process.env.VITE_BASE_URL}/reset-password?token=${token}&username=${user.name}&callbackURL=${process.env.VITE_BASE_URL}/app`;

      await resend.emails.send({
        from: "reset@urmomlovme.fr",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Reset your password by clicking <a href="${url}">here</a></p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
    sendVerificationEmail: async ({ user, token }) => {
      const url = `${process.env.VITE_BASE_URL}/verify-email?token=${token}&username=${user.name}&callbackURL=${process.env.VITE_BASE_URL}/app?emailVerified=true`;

      await resend.emails.send({
        from: "verify@urmomlovme.fr",
        to: user.email,
        subject: "Verify your email",
        html: `<p>Verify your email by clicking <a href="${url}">here</a></p>`,
      });
    },
  },

  experimental: {
    // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },
});
