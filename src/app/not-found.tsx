import React from "react";
import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 text-[#FB7C20] flex items-center justify-center mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>

        <span className="text-sm font-semibold uppercase tracking-wider text-[#FB7C20] mb-1">
          404 Error
        </span>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The page you are looking for doesn&apos;t exist or has been moved to another URL.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FB7C20] hover:bg-[#e06b16] text-white font-medium text-sm rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
