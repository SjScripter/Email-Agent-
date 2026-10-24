"use client";

import { RecipientWithStatus } from "@/types/recipient";

export function RecipientTable({ recipients, onChange, stats, filename }: { recipients: RecipientWithStatus[]; onChange: (r: RecipientWithStatus[]) => void; stats: any; filename: string }) {
  const toggle = (idx: number) => {
    const next = [...recipients];
    if (next[idx].status === "Valid") {
      next[idx].selected = !next[idx].selected;
      onChange(next);
    }
  };

  const selectedCount = recipients.filter(r => r.selected && r.status === "Valid").length;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recipients</h2>
        <p className="text-sm text-gray-600 mt-1">{filename} — {stats.valid} valid, {stats.invalid} invalid, {stats.duplicates} duplicates removed</p>
        <p className="text-sm text-gray-700 mt-1">{selectedCount} of {stats.valid} recipients selected</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipients.map((r, idx) => (
              <tr key={idx} className={r.status !== "Valid" ? "opacity-60" : ""}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={r.selected && r.status === "Valid"}
                    disabled={r.status !== "Valid"}
                    onChange={() => toggle(idx)}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{r.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{r.schoolName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{r.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${r.status === "Valid" ? "bg-green-100 text-green-800" : r.status === "Invalid" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
