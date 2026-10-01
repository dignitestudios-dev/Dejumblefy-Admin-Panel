"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h1 className="text-xl font-bold text-slate-900 mb-2">
          An unexpected error occurred
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          We encountered an issue while rendering this page. You can try refreshing or returning to the dashboard.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FB7C20] hover:bg-[#e06b16] text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
