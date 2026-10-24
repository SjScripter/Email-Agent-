"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { RecipientTable } from "@/components/RecipientTable";
import { EmailComposer } from "@/components/EmailComposer";
import { EmailPreview } from "@/components/EmailPreview";
import { TestEmailDialog } from "@/components/TestEmailDialog";
import { SendConfirmation } from "@/components/SendConfirmation";
import { SendResults } from "@/components/SendResults";
import { RecipientWithStatus } from "@/types/recipient";

export default function Dashboard() {
  const [step, setStep] = useState(0);
  const [recipients, setRecipients] = useState<RecipientWithStatus[]>([]);
  const [filename, setFilename] = useState("");
  const [stats, setStats] = useState({ rows: 0, valid: 0, invalid: 0, duplicates: 0 });
  const [payload, setPayload] = useState({
    fromName: "",
    replyTo: "",
    subject: "",
    body: "",
    imageDataUrl: "",
    footer: "If you are not the appropriate contact for this, please let us know.",
    unsubscribeText: "If you would like to unsubscribe, please reply with 'Unsubscribe'.",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<any>(null);

  const selectedCount = recipients.filter(r => r.selected && r.status === "Valid").length;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">School Outreach</h1>
          <p className="mt-1 text-sm text-gray-600">Send personalized outreach emails from one place.</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3, 4].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {s + 1}
                </div>
                {s < 4 && <div className={`flex-1 h-1 mx-2 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Upload</span>
            <span>Recipients</span>
            <span>Compose</span>
            <span>Preview</span>
            <span>Send</span>
          </div>
        </div>

        {step === 0 && (
          <FileUploader
            onParsed={(data) => {
              setRecipients(data.recipients);
              setFilename(data.filename);
              setStats(data.stats);
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <div className="space-y-4">
            <RecipientTable
              recipients={recipients}
              onChange={setRecipients}
              stats={stats}
              filename={filename}
            />
            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="px-4 py-2 border rounded-md">Back</button>
              <button onClick={() => setStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Next: Compose Email</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <EmailComposer payload={payload} onChange={setPayload} />
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-4 py-2 border rounded-md">Back</button>
              <button onClick={() => setStep(3)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Next: Preview</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <EmailPreview recipients={recipients.filter(r => r.selected && r.status === "Valid")} payload={payload} />
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-md">Back</button>
              <div className="flex gap-2">
                <TestEmailDialog payload={payload} recipients={recipients.filter(r => r.selected && r.status === "Valid")} />
                <button onClick={() => setShowConfirm(true)} disabled={selectedCount === 0} className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-50">Send Emails</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && results && (
          <SendResults results={results} />
        )}
      </div>

      {showConfirm && (
        <SendConfirmation
          count={selectedCount}
          payload={payload}
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setShowConfirm(false);
            setSending(true);
            setStep(4);
            try {
              const res = await fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  payload,
                  recipients: recipients.filter(r => r.selected && r.status === "Valid").map(r => ({ name: r.name, schoolName: r.schoolName, email: r.email })),
                }),
              });
              const data = await res.json();
              setResults(data);
            } catch (e: any) {
              setResults({ error: e.message });
            } finally {
              setSending(false);
            }
          }}
        />
      )}
    </main>
  );
}
