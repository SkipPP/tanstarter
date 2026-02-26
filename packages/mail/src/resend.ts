import { Resend } from 'resend';

if (!process.env.SERVER_RESEND_API_KEY) {
  throw new Error(
    'Missing SERVER_RESEND_API_KEY environment variable.'
  );
}

export const resend = new Resend(process.env.SERVER_RESEND_API_KEY);