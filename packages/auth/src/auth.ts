import "@tanstack/react-start/server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@repo/db";
import * as schema from "@repo/db/schema";
import { resend } from "@repo/mail/resend";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { requireEnv } from "./env";

const env = requireEnv(["VITE_BASE_URL", "SERVER_AUTH_SECRET", "SERVER_MAIL_FROM"]);

export const auth = betterAuth({
  baseURL: env.VITE_BASE_URL,
  secret: env.SERVER_AUTH_SECRET,
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

  /* socialProviders: {
    github: {
      clientId: process.env.SERVER_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.SERVER_GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.SERVER_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.SERVER_GOOGLE_CLIENT_SECRET as string,
    },
  }, */

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
        html: `<p>Reset your password by clicking <a href="${url}">here</a></p>`,
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
        html: `<p>Verify your email by clicking <a href="${url}">here</a></p>`,
      });
    },
  },

  experimental: {
    // https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
    joins: true,
  },
});
