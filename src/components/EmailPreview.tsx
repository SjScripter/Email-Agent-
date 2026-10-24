"use client";

import { useState } from "react";
import { personalizeSubject, personalizeBody } from "@/lib/template";

export function EmailPreview({ recipients, payload }: { recipients: any[]; payload: any }) {
  const [idx, setIdx] = useState(0);
  const recipient = recipients[idx] || { name: "", schoolName: "", email: "" };

  const subject = personalizeSubject(payload.subject || "", recipient);
  let body = personalizeBody(payload.body || "", recipient);
  if (payload.footer) body += "\n\n" + payload.footer;
  if (payload.unsubscribeText) body += "\n\n" + payload.unsubscribeText;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Email Preview</h2>
      {recipients.length === 0 ? (
        <p className="text-sm text-gray-600">No recipients selected.</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Recipient</label>
            <select value={idx} onChange={(e) => setIdx(Number(e.target.value))} className="border rounded-md px-3 py-2">
              {recipients.map((r, i) => (
                <option key={i} value={i}>{r.name} ({r.email})</option>
              ))}
            </select>
            <p className="text-xs text-gray-600 mt-1">School: {recipient.schoolName}</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium">Subject: {subject}</p>
            <div className="mt-4 whitespace-pre-wrap text-sm text-gray-900">{body}</div>
            {payload.imageDataUrl && (
              <img src={payload.imageDataUrl} alt="Banner" className="mt-4 max-w-full rounded" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
