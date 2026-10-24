import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  resendClient = new Resend(apiKey);
  return resendClient;
}

export function getSender() {
  const fromEmail = process.env.EMAIL_FROM || "outreach@example.com";
  const fromName = process.env.EMAIL_FROM_NAME || "Sarthak";
  return {
    email: fromEmail,
    name: fromName,
  };
}
