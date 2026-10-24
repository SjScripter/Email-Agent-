import sanitizeHtml from "sanitize-html";

export function toHtmlEmail(body: string, options?: { footer?: string; unsubscribeText?: string; imageDataUrl?: string }): string {
  // Convert newlines to paragraphs
  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => {
      const clean = p.replace(/\n/g, "<br/>");
      return `<p>${escapeHtml(clean).replace(/&lt;br\/&gt;/g, "<br/>")}</p>`;
    })
    .join("\n");

  let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333;">
  ${paragraphs}
`;

  if (options?.imageDataUrl) {
    html += `  <p><img src="${options.imageDataUrl}" alt="Promotional image" style="max-width: 100%; height: auto;" /></p>\n`;
  }

  if (options?.footer) {
    html += `  <p style="color: #666; font-size: 0.9em;">${escapeHtml(options.footer)}</p>\n`;
  }

  if (options?.unsubscribeText) {
    html += `  <p style="color: #666; font-size: 0.9em;">${escapeHtml(options.unsubscribeText)}</p>\n`;
  }

  html += `</body>
</html>`;

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizeCustomHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "style"],
      a: ["href", "name", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "data", "mailto"],
  });
}
