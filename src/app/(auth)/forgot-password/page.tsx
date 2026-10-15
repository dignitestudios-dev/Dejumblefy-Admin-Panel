"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Loader2, KeyRound, AlertCircle } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { forgotPassword } from "@/features/auth/api/auth.api";
import { formatErrorMessage } from "@/utils/error";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.replace(/\s+/g, "");
    if (!cleanEmail) {
      setErrorMsg("Please enter your administrator email address");
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email: cleanEmail });
      router.push(`/verify-otp?email=${encodeURIComponent(cleanEmail)}`);
    } catch (err: unknown) {
      setErrorMsg(formatErrorMessage(err, "Failed to send reset code"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="mb-6 text-center flex flex-col items-center">
            <div className="relative mb-3 flex items-center justify-center">
              <Image
                src={logoImg}
                alt="Dejumblefy"
                className="h-28 sm:h-32 w-auto max-w-[280px] object-contain drop-shadow-sm"
                priority
              />
            </div>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FB7C20]/10 text-[#FB7C20]">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Forgot Password
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-600">
              Enter your email to receive a password recovery verification code
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.replace(/\s+/g, ""))}
                  placeholder="Enter Email"
                  required
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-[#FB7C20] font-semibold text-white shadow-sm transition-all hover:bg-[#E86B12] focus:outline-none focus:ring-2 focus:ring-[#FB7C20]/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#000072] hover:text-[#FB7C20] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
