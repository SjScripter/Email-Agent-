"use client";

import { useState } from "react";

export function EmailComposer({ payload, onChange }: { payload: any; onChange: (p: any) => void }) {
  const [mode, setMode] = useState<"simple" | "custom">("simple");

  const insertVar = (v: string) => {
    onChange({ ...payload, body: payload.body + " " + v });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Email Composer</h2>
        <div className="flex gap-2">
          <button onClick={() => setMode("simple")} className={`px-3 py-1 rounded text-sm ${mode === "simple" ? "bg-blue-600 text-white" : "border"}`}>Simple Editor</button>
          <button onClick={() => setMode("custom")} className={`px-3 py-1 rounded text-sm ${mode === "custom" ? "bg-blue-600 text-white" : "border"}`}>Custom HTML</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Name</label>
          <input type="text" value={payload.fromName} onChange={(e) => onChange({ ...payload, fromName: e.target.value })} className="w-full border rounded-md px-3 py-2" placeholder="Sarthak" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reply-To</label>
          <input type="email" value={payload.replyTo} onChange={(e) => onChange({ ...payload, replyTo: e.target.value })} className="w-full border rounded-md px-3 py-2" placeholder="you@example.com" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subject</label>
        <input type="text" value={payload.subject} onChange={(e) => onChange({ ...payload, subject: e.target.value })} className="w-full border rounded-md px-3 py-2" placeholder="Student Mentorship Program for {{school_name}}" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email Body</label>
        <div className="flex gap-2 mb-2">
          <button onClick={() => insertVar("{{name}}")} className="px-2 py-1 text-xs border rounded">+ Name</button>
          <button onClick={() => insertVar("{{school_name}}")} className="px-2 py-1 text-xs border rounded">+ School Name</button>
        </div>
        {mode === "simple" ? (
          <textarea value={payload.body} onChange={(e) => onChange({ ...payload, body: e.target.value })} rows={10} className="w-full border rounded-md px-3 py-2" placeholder="Hello {{name}},&#10;&#10;I'm reaching out regarding {{school_name}}..." />
        ) : (
          <textarea value={payload.body} onChange={(e) => onChange({ ...payload, body: e.target.value })} rows={10} className="w-full border rounded-md px-3 py-2 font-mono text-sm" placeholder="<p>Hello {{name}},</p>..." />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Footer (optional)</label>
          <input type="text" value={payload.footer} onChange={(e) => onChange({ ...payload, footer: e.target.value })} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unsubscribe Text (optional)</label>
          <input type="text" value={payload.unsubscribeText} onChange={(e) => onChange({ ...payload, unsubscribeText: e.target.value })} className="w-full border rounded-md px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Promotional Image (optional)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            onChange({ ...payload, imageDataUrl: ev.target?.result as string, imageMimeType: file.type });
          };
          reader.readAsDataURL(file);
        }} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {payload.imageDataUrl && (
          <img src={payload.imageDataUrl} alt="Preview" className="mt-2 max-h-40 rounded" />
        )}
      </div>
    </div>
  );
}
