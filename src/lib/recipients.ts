import { Recipient, RecipientWithStatus } from "@/types/recipient";
import { isValidEmail } from "./validation";

const NAME_ALIASES = ["name", "contact_name", "recipient_name"];
const SCHOOL_ALIASES = ["school_name", "school", "institution", "institution_name"];
const EMAIL_ALIASES = ["email", "email_id", "mail", "mail_id"];

export function findColumn(headers: string[], aliases: string[]): string | null {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().trim();
    if (aliases.includes(h)) {
      return headers[i];
    }
  }
  return null;
}

export function normalizeKey(key: string): string {
  return key.toLowerCase().trim();
}

export function parseRecipients(rows: any[]): {
  recipients: RecipientWithStatus[];
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!Array.isArray(rows) || rows.length === 0) {
    return { recipients: [], warnings: ["Empty spreadsheet"] };
  }

  const headers = Object.keys(rows[0]);
  const nameKey = findColumn(headers, NAME_ALIASES) || headers.find(h => normalizeKey(h).includes("name")) || null;
  const schoolKey = findColumn(headers, SCHOOL_ALIASES) || headers.find(h => normalizeKey(h).includes("school") || normalizeKey(h).includes("institution")) || null;
  const emailKey = findColumn(headers, EMAIL_ALIASES) || headers.find(h => normalizeKey(h).includes("email") || normalizeKey(h).includes("mail")) || null;

  if (!emailKey) {
    warnings.push("Missing required column: email");
    return { recipients: [], warnings };
  }

  const seenEmails = new Map<string, number>();
  const result: RecipientWithStatus[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rawEmail = row[emailKey];
    const email = typeof rawEmail === "string" ? rawEmail.trim() : String(rawEmail || "").trim();
    if (!email) {
      // treat blank as invalid
      const name = nameKey ? (row[nameKey] ? String(row[nameKey]).trim() : "") : "";
      const schoolName = schoolKey ? (row[schoolKey] ? String(row[schoolKey]).trim() : "") : "";
      result.push({ name, schoolName, email: "", status: "Invalid", selected: false });
      continue;
    }

    const name = nameKey ? (row[nameKey] ? String(row[nameKey]).trim() : "") : "";
    const schoolName = schoolKey ? (row[schoolKey] ? String(row[schoolKey]).trim() : "") : "";

    if (!isValidEmail(email)) {
      result.push({ name, schoolName, email, status: "Invalid", selected: false });
      continue;
    }

    const key = email.toLowerCase();
    if (seenEmails.has(key)) {
      const originalIndex = seenEmails.get(key)!;
      // mark duplicate
      result.push({ name, schoolName, email, status: "Duplicate", selected: false });
      // ensure original is marked duplicate if not already? keep original as first; we'll handle by collecting unique
      continue;
    }
    seenEmails.set(key, i);
    result.push({ name, schoolName, email, status: "Valid", selected: true });
  }

  // Better duplicate handling: mark all duplicates
  const emailCounts = new Map<string, number>();
  for (let i = 0; i < result.length; i++) {
    const e = result[i].email.toLowerCase();
    emailCounts.set(e, (emailCounts.get(e) || 0) + 1);
  }

  for (let i = 0; i < result.length; i++) {
    if (result[i].status === "Invalid") continue;
    const e = result[i].email.toLowerCase();
    if ((emailCounts.get(e) || 0) > 1) {
      result[i].status = "Duplicate";
      result[i].selected = false;
    }
  }

  // Keep only valid unique? But we need to show duplicates separately; spec says remove duplicates - but table should show status
  // "Remove duplicate email addresses" - so final list of recipients to send is unique valid; but UI shows table with status
  const validUnique = result.filter(r => r.status === "Valid" && r.selected);

  if (validUnique.length > 100) {
    warnings.push("More than 100 recipients");
  }

  return { recipients: result, warnings };
}
