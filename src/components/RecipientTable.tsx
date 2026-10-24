"use client";

import { RecipientWithStatus } from "@/types/recipient";
import { Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recipients</h2>
              <p className="text-sm text-gray-600 mt-0.5">{filename}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">{stats.valid} Valid</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-gray-700">{stats.invalid} Invalid</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-gray-700">{stats.duplicates} Duplicates</span>
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm font-medium text-blue-900">{selectedCount} of {stats.valid} recipients selected for sending</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">School</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipients.map((r, idx) => (
              <tr key={idx} className={`hover:bg-gray-50 transition-colors ${r.status !== "Valid" ? "opacity-50" : ""}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={r.selected && r.status === "Valid"}
                    disabled={r.status !== "Valid"}
                    onChange={() => toggle(idx)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.name || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.schoolName || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "Valid" 
                      ? "bg-green-100 text-green-800" 
                      : r.status === "Invalid" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                  }`}>
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
