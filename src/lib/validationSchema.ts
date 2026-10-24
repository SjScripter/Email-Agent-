import { z } from "zod";

export const RecipientSchema = z.object({
  name: z.string(),
  schoolName: z.string(),
  email: z.string().email(),
});

export const EmailPayloadSchema = z.object({
  fromName: z.string().optional(),
  replyTo: z.string().optional(),
  subject: z.string().min(1),
  body: z.string().min(1),
  imageDataUrl: z.string().optional(),
  imageMimeType: z.string().optional(),
  footer: z.string().optional(),
  unsubscribeText: z.string().optional(),
}).passthrough();

export const TestEmailSchema = z.object({
  testEmail: z.string().email(),
  payload: EmailPayloadSchema,
  recipient: RecipientSchema,
});

export const SendEmailSchema = z.object({
  payload: EmailPayloadSchema,
  recipients: z.array(RecipientSchema).min(1).max(100),
  idempotencyKey: z.string().optional(),
}).passthrough();
