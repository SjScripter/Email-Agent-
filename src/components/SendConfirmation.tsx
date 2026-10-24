"use client";

export function SendConfirmation({ count, payload, onCancel, onConfirm }: { count: number; payload: any; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Ready to send</h3>
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <p><strong>Recipients:</strong> {count}</p>
          <p><strong>From:</strong> {payload.fromName || "Sarthak"} &lt;{process.env.NEXT_PUBLIC_EMAIL_FROM || "outreach@example.com"}&gt;</p>
          <p><strong>Subject:</strong> {payload.subject}</p>
          <p className="text-gray-600">This action will send {count} individual emails.</p>
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded-md">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded-md">Send {count} Emails</button>
        </div>
      </div>
    </div>
  );
}
