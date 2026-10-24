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
import { Mail, Upload, Users, Edit3, Eye, Send } from "lucide-react";

const steps = [
  { id: 0, name: "Upload", icon: Upload },
  { id: 1, name: "Recipients", icon: Users },
  { id: 2, name: "Compose", icon: Edit3 },
  { id: 3, name: "Preview", icon: Eye },
  { id: 4, name: "Send", icon: Send },
];

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Outreach</h1>
              <p className="mt-1 text-sm text-gray-600">Send personalized outreach emails from one place.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((s, idx) => (
                <li key={s.id} className="relative flex-1">
                  <div className="flex items-center">
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                      step >= s.id 
                        ? "bg-blue-600 shadow-lg shadow-blue-600/30" 
                        : "bg-white border-2 border-gray-300"
                    }`}>
                      <s.icon className={`h-6 w-6 ${step >= s.id ? "text-white" : "text-gray-400"}`} />
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                        step > s.id ? "bg-blue-600" : "bg-gray-300"
                      }`} />
                    )}
                  </div>
                  <div className="mt-3">
                    <p className={`text-sm font-medium ${step >= s.id ? "text-blue-600" : "text-gray-500"}`}>
                      {s.name}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="transition-all duration-300">
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
            <div className="space-y-6">
              <RecipientTable
                recipients={recipients}
                onChange={setRecipients}
                stats={stats}
                filename={filename}
              />
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(0)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">Back to Upload</button>
                <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">Next: Compose Email</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <EmailComposer payload={payload} onChange={setPayload} />
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">Back to Recipients</button>
                <button onClick={() => setStep(3)} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">Next: Preview & Send</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <EmailPreview recipients={recipients.filter(r => r.selected && r.status === "Valid")} payload={payload} />
              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">Back to Compose</button>
                <div className="flex gap-3">
                  <TestEmailDialog payload={payload} recipients={recipients.filter(r => r.selected && r.status === "Valid")} />
                  <button onClick={() => setShowConfirm(true)} disabled={selectedCount === 0} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Send {selectedCount} Emails</button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && results && (
            <SendResults results={results} />
          )}
        </div>
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
