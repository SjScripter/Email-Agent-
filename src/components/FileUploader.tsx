"use client";

import { useState } from "react";
import { parseCSV } from "@/lib/csv";
import { parseExcel } from "@/lib/excel";
import { parseRecipients } from "@/lib/recipients";

export function FileUploader({ onParsed }: { onParsed: (data: any) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setError("");
    setLoading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      let rows: any[] = [];
      if (ext === "csv") {
        rows = await parseCSV(file);
      } else if (ext === "xlsx" || ext === "xls") {
        rows = await parseExcel(file);
      } else {
        throw new Error("Unsupported file type");
      }
      const { recipients, warnings } = parseRecipients(rows);
      if (warnings.length > 0 && warnings[0] === "Empty spreadsheet") {
        throw new Error("Empty spreadsheet");
      }
      const valid = recipients.filter(r => r.status === "Valid").length;
      const invalid = recipients.filter(r => r.status === "Invalid").length;
      const duplicates = recipients.filter(r => r.status === "Duplicate").length;
      onParsed({
        recipients,
        filename: file.name,
        stats: { rows: rows.length, valid, invalid, duplicates },
      });
    } catch (e: any) {
      setError(e.message || "Failed to parse file");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Upload Recipients</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-gray-600">
            <p className="text-sm">Drag and drop your CSV or Excel file here</p>
            <p className="text-xs mt-1">or click to browse</p>
            <p className="text-xs mt-2 text-gray-500">.csv, .xlsx, .xls (max 100 recipients)</p>
          </div>
        </label>
      </div>
      {loading && <p className="mt-2 text-sm text-gray-600">Parsing...</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
