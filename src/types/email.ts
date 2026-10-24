export type EmailPayload = {
  fromName?: string;
  replyTo?: string;
  subject: string;
  body: string;
  imageDataUrl?: string;
  imageMimeType?: string;
  footer?: string;
  unsubscribeText?: string;
};
