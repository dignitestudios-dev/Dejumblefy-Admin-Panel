"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Unable to load section
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          An error occurred while loading this view. Try again or navigate to another page.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FB7C20] hover:bg-[#e06b16] text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
        >
          <RotateCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
