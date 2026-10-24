"use client";

import { Upload, FileText, CheckCircle } from "lucide-react";
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
        throw new Error("Unsupported file type. Please upload .csv, .xlsx, or .xls");
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Upload className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Upload Recipients</h2>
            <p className="text-sm text-gray-600 mt-0.5">Drag and drop or click to upload your recipient list</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive 
              ? "border-blue-500 bg-blue-50 scale-[1.02]" 
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleChange} className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-full mb-4 ${dragActive ? "bg-blue-100" : "bg-gray-100"}`}>
                <FileText className={`h-10 w-10 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {dragActive ? "Drop your file here" : "Choose a file or drag & drop"}
              </p>
              <p className="text-sm text-gray-600 mb-4">CSV, XLSX, or XLS files only</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="h-4 w-4" />
                <span>Maximum 100 recipients</span>
              </div>
            </div>
          </label>
        </div>
        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Parsing file...</span>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
