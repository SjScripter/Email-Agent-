export function replaceVariables(template: string, recipient: { name: string; schoolName: string }): string {
  if (!template) return template;
  let result = template;
  result = result.replace(/\{\{\s*name\s*\}\}/gi, recipient.name || "");
  result = result.replace(/\{\{\s*school_name\s*\}\}/gi, recipient.schoolName || "");
  result = result.replace(/\{\{\s*schoolName\s*\}\}/gi, recipient.schoolName || "");
  return result;
}

export function personalizeSubject(subject: string, recipient: { name: string; schoolName: string }): string {
  return replaceVariables(subject, recipient);
}

export function personalizeBody(body: string, recipient: { name: string; schoolName: string }): string {
  return replaceVariables(body, recipient);
}
