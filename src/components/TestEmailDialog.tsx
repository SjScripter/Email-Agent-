"use client";

import { useState } from "react";

export function TestEmailDialog({ payload, recipients }: { payload: any; recipients: any[] }) {
  const [open, setOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");

  const sendTest = async () => {
    if (!testEmail) return;
    setSending(true);
    setResult("");
    try {
      const recipient = recipients[0] || { name: "", schoolName: "", email: "" };
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail, payload, recipient }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult("Test email sent successfully.");
      } else {
        setResult(data.error || "Failed to send test email");
      }
    } catch (e: any) {
      setResult(e.message);
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return <button onClick={() => setOpen(true)} className="px-4 py-2 border rounded-md">Send Test Email</button>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Send Test Email</h3>
        <p className="text-sm text-gray-600 mb-4">Test email will use first selected recipient's personalization data but send only to the test address.</p>
        <input type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} placeholder="your@email.com" className="w-full border rounded-md px-3 py-2 mb-4" />
        {result && <p className="text-sm mb-4">{result}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded-md">Cancel</button>
          <button onClick={sendTest} disabled={sending || !testEmail} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">{sending ? "Sending..." : "Send Test"}</button>
        </div>
      </div>
    </div>
  );
}
