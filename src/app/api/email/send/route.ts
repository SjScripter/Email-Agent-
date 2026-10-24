import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { getResendClient, getSender } from "@/lib/resend";
import { SendEmailSchema } from "@/lib/validationSchema";
import { personalizeSubject, personalizeBody } from "@/lib/template";
import { toHtmlEmail } from "@/lib/html";

async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SendEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
    }

    const { payload, recipients } = parsed.data;
    if (recipients.length > 100) {
      return NextResponse.json({ error: "Maximum 100 recipients" }, { status: 400 });
    }

    const resend = getResendClient();
    const sender = getSender();
    const fromName = payload.fromName || sender.name;
    const fromEmail = sender.email;

    const results: Array<{ email: string; name: string; success: boolean; error?: string; id?: string }> = [];

    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      try {
        const subject = personalizeSubject(payload.subject, recipient);
        let bodyText = personalizeBody(payload.body, recipient);
        if (payload.footer) bodyText += "\n\n" + payload.footer;
        if (payload.unsubscribeText) bodyText += "\n\n" + payload.unsubscribeText;

        const html = toHtmlEmail(bodyText, { footer: payload.footer, unsubscribeText: payload.unsubscribeText, imageDataUrl: payload.imageDataUrl });

        const result = await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: recipient.email,
          replyTo: payload.replyTo && payload.replyTo.trim() ? payload.replyTo.trim() : undefined,
          subject,
          html,
          text: bodyText,
        });

        results.push({ email: recipient.email, name: recipient.name, success: true, id: result.data?.id });
      } catch (error: any) {
        results.push({ email: recipient.email, name: recipient.name, success: false, error: error.message || "Failed to send" });
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({ success: true, total: recipients.length, successful, failed, results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send emails" }, { status: 500 });
  }
}

export const POST = withAuth(handler);
