"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Mail,
  ArrowLeft,
  Loader2,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import logoImg from "@/assets/logo.png";
import { verifyOtp, forgotPassword } from "../api/auth.api";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Focus first input box on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const otpCode = otpDigits.join("");

  const handleDigitChange = (index: number, value: string) => {
    // If user pasted multiple characters directly into the field
    const numericChars = value.replace(/\D/g, "");

    if (numericChars.length > 1) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 4; i++) {
        if (i >= index && numericChars[i - index]) {
          newDigits[i] = numericChars[i - index];
        }
      }
      setOtpDigits(newDigits);
const nextFocus = Math.min(index + numericChars.length, 3);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    // Single character input
    const singleChar = numericChars.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = singleChar;
    setOtpDigits(newDigits);

    // Auto-advance to next box if digit entered
if (singleChar && index < 3) {
        inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        // Clear current box
        const newDigits = [...otpDigits];
        newDigits[index] = "";
        setOtpDigits(newDigits);
      } else if (index > 0) {
        // Backspace on empty box moves to previous and clears it
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }  else if (e.key === "ArrowRight" && index < 3) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);

    if (pasteData.length > 0) {
      const newDigits = ["", "", "", ""];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);

      // Focus the last filled box or next empty box
const targetIndex = Math.min(pasteData.length, 3);
      inputRefs.current[targetIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Email address is required.");
      return;
    }

   if (otpCode.length < 4) {
  setErrorMsg("Please enter the complete 4-digit verification code.");
  return;
}

    setIsLoading(true);
    try {
      const res = await verifyOtp({ email: trimmedEmail, otp: otpCode });
      router.push(`/reset-password?token=${encodeURIComponent(res.resetToken)}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Invalid or expired verification code.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email to resend code.");
      return;
    }
    if (resendCooldown > 0) return;

    setIsResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await forgotPassword({ email: email.trim() });
      setSuccessMsg("A new verification code has been dispatched to your email.");
      setResendCooldown(45);
      // Reset otp digits and focus first
setOtpDigits(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        error?.response?.data?.message || error?.message || "Failed to resend code.";
      setErrorMsg(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 text-center flex flex-col items-center">
          <Image
            src={logoImg}
            alt="Dejumblify"
            className="h-24 w-auto max-w-[240px] object-contain mb-4"
            priority
          />
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#000072]/10 text-[#000072]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Verify Security Code
          </h1>
          <p className="mt-1 text-xs text-slate-500">
Enter the 4-digit OTP code received at your administrator email          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Admin Email Field */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dejumblify.com"
                required
                disabled
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
              />
            </div>
          </div>

          {/* 6 OTP Boxes */}
          <div>
          <div className="mb-2 flex items-center justify-between">
  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
    Security Code (4 Digits)
  </label>

  {otpCode.length === 4 && (
    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
      <CheckCircle2 className="h-3 w-3" />
      Ready
    </span>
  )}
</div>
<div className="flex w-full items-center justify-center gap-3 sm:gap-4">
                {otpDigits.map((digit, index) => {
                const isFilled = Boolean(digit);
                return (
                  <input
  key={index}
  ref={(el) => {
    inputRefs.current[index] = el;
  }}
  type="text"
  inputMode="numeric"
  autoComplete="one-time-code"
  pattern="[0-9]*"
  maxLength={1}
  value={digit}
  onChange={(e) => handleDigitChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  onPaste={handlePaste}
  className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl text-center font-mono text-xl sm:text-2xl font-bold transition-all focus:outline-none ${
  isFilled
    ? "border-2 border-[#000072] bg-white text-slate-900 shadow-xs"
    : "border border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300"
} focus:border-[#FB7C20] focus:bg-white focus:ring-2 focus:ring-[#FB7C20]/20`}
/>
                );
              })}
            </div>
           <p className="mt-2 text-center text-[11px] text-slate-400">
  Tip: You can paste the complete 4-digit code directly
</p>
          </div>

          {/* Resend Action */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500">Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="flex items-center gap-1 font-semibold text-[#000072] hover:text-[#FB7C20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3 w-3 ${isResending ? "animate-spin" : ""}`} />
              <span>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otpCode.length < 4}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[#FB7C20] font-semibold text-white shadow-sm transition-all hover:bg-[#E86B12] focus:outline-none focus:ring-2 focus:ring-[#FB7C20]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Verifying code...</span>
              </>
            ) : (
              "Confirm Code"
            )}
          </button>
        </form>

        {/* Back Link */}
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
  );
}
