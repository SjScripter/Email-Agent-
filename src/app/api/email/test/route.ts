import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { getResendClient, getSender } from "@/lib/resend";
import { TestEmailSchema } from "@/lib/validationSchema";
import { personalizeSubject, personalizeBody } from "@/lib/template";
import { toHtmlEmail, sanitizeCustomHtml } from "@/lib/html";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = TestEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { testEmail, payload, recipient } = parsed.data;
    const subject = personalizeSubject(payload.subject, recipient);
    let bodyText = personalizeBody(payload.body, recipient);
    if (payload.footer) bodyText += "\n\n" + payload.footer;
    if (payload.unsubscribeText) bodyText += "\n\n" + payload.unsubscribeText;

    let html: string;
    if (payload.imageDataUrl) {
      html = toHtmlEmail(bodyText, { footer: payload.footer, unsubscribeText: payload.unsubscribeText, imageDataUrl: payload.imageDataUrl });
    } else {
      html = toHtmlEmail(bodyText, { footer: payload.footer, unsubscribeText: payload.unsubscribeText });
    }

    // If custom HTML is intended - but schema doesn't have mode; keep simple editor
    const resend = getResendClient();
    const sender = getSender();

    const result = await resend.emails.send({
      from: `${payload.fromName || sender.name} <${sender.email}>`,
      to: testEmail,
      replyTo: payload.replyTo || undefined,
      subject,
      html,
      text: bodyText,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send test email" }, { status: 500 });
  }
}

export const POST = withAuth(handler);
