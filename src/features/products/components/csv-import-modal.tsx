"use client";

import { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  FileCheck,
} from "lucide-react";
import { useImportProductsCsvMutation } from "../api/products.mutations";
import { downloadCsvTemplate } from "../api/products.api";
import { ImportCsvResponse } from "../types/products.types";

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CsvImportModal({ isOpen, onClose }: CsvImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<ImportCsvResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportProductsCsvMutation();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.endsWith(".csv")) {
        setErrorMessage("Please select a valid .csv file.");
        return;
      }
      setFile(selected);
      setErrorMessage(null);
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (!selected.name.endsWith(".csv")) {
        setErrorMessage("Please drop a valid .csv file.");
        return;
      }
      setFile(selected);
      setErrorMessage(null);
      setResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      await downloadCsvTemplate();
    } catch {
      setErrorMessage("Failed to download CSV template.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Please select a CSV file to upload.");
      return;
    }

    setErrorMessage(null);
    setResult(null);

    try {
      const response = await importMutation.mutateAsync({ file, dryRun });
      setResult(response);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Failed to process CSV file."
      );
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Import Products from CSV</h3>
              <p className="text-xs text-slate-500">
                Bulk upload or update catalog products via structured spreadsheet
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Action to download template */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="text-slate-600">
              Need the template header format? Download sample spreadsheet:
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 text-[#FB7C20]" />
              )}
              <span>Template .csv</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileCheck className="h-10 w-10 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-900">{file.name}</span>
                <span className="text-[11px] text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB — Click to choose a different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">
                  Click to browse or drag and drop your CSV file here
                </p>
                <p className="text-[11px] text-slate-400">Only .csv files are supported</p>
              </div>
            )}
          </div>

          {/* Dry Run Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="dryRun"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#FB7C20] focus:ring-[#FB7C20]"
            />
            <label htmlFor="dryRun" className="text-xs font-medium text-slate-700">
              Dry Run (validate schema & counts without saving to database)
            </label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Import Results Summary */}
          {result && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  {result.dryRun ? "Dry Run Completed (Validation Only)" : "Import Finished Successfully"}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Total Rows</div>
                  <div className="font-bold text-slate-800">{result.totalRows}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-emerald-600">Inserted</div>
                  <div className="font-bold text-emerald-600">{result.inserted ?? 0}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-blue-600">Updated</div>
                  <div className="font-bold text-blue-600">{result.updated ?? 0}</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-rose-600">Failed</div>
                  <div className="font-bold text-rose-600">{result.failed ?? 0}</div>
                </div>
              </div>

              {result.errors && result.errors.length > 0 && (
                <div className="space-y-1 pt-2">
                  <span className="text-[11px] font-semibold text-rose-700">Error Details:</span>
                  <div className="max-h-28 overflow-y-auto space-y-1 rounded-lg border border-rose-200 bg-rose-50/50 p-2 text-[11px] text-rose-800 font-mono">
                    {result.errors.map((err, i) => (
                      <div key={i}>
                        Row {err.row}: {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={!file || importMutation.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors disabled:opacity-50"
            >
              {importMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{dryRun ? "Validate CSV" : "Import Products"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
