import { Resend } from "resend";

if (!process.env.SERVER_RESEND_API_KEY) {
  throw new Error("Missing environment variable: SERVER_RESEND_API_KEY");
}

export const resend = new Resend(process.env.SERVER_RESEND_API_KEY);
