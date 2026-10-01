"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, RotateCw, X } from "lucide-react";

export function ServerErrorDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleServerError = () => {
      setIsOpen(true);
    };

    window.addEventListener("app:server-error", handleServerError);
    return () => {
      window.removeEventListener("app:server-error", handleServerError);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="server-error-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        
        <h2 id="server-error-title" className="text-xl font-bold text-slate-900 mb-2">
          Something went wrong on our end
        </h2>
        
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          We&apos;re having trouble connecting right now. Please try again in a moment.
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FB7C20] hover:bg-[#e06b16] text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close dialog"
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
