"use client";

import { useState, useMemo } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Check,
  X,
} from "lucide-react";
import { useChangePasswordMutation } from "../api/settings.mutations";

export default function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changePasswordMutation = useChangePasswordMutation();

  const passwordValidation = useMemo(() => {
    return {
      hasMinLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[^A-Za-z0-9]/.test(newPassword),
      matchesConfirm: Boolean(newPassword && newPassword === confirmPassword),
    };
  }, [newPassword, confirmPassword]);

  const isFormValid =
    currentPassword.length >= 6 &&
    passwordValidation.hasMinLength &&
    passwordValidation.hasUppercase &&
    passwordValidation.hasNumber &&
    passwordValidation.hasSpecial &&
    passwordValidation.matchesConfirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Current password is required.");
      return;
    }

    if (!isFormValid) {
      setErrorMessage("Please fulfill all password security requirements.");
      return;
    }

    try {
      const response = await changePasswordMutation.mutateAsync({
        currentPassword,
        newPassword,
      });

      setSuccessMessage(response.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Failed to update password."
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#000072] border border-blue-100">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Security & Authentication</h3>
            <p className="text-xs text-slate-500">
              Change administrator master credentials and access password
            </p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Password <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your active password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:bg-white focus:border-[#FB7C20] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:bg-white focus:border-[#FB7C20] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs text-slate-900 focus:bg-white focus:border-[#FB7C20] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Security Requirements Checklist */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <span className="text-[11px] font-semibold text-slate-700">Password Requirements:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
            <div className="flex items-center gap-1.5">
              {passwordValidation.hasMinLength ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />
              )}
              <span
                className={
                  passwordValidation.hasMinLength
                    ? "text-emerald-700 font-medium"
                    : "text-slate-500"
                }
              >
                Minimum 8 characters
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {passwordValidation.hasUppercase ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />
              )}
              <span
                className={
                  passwordValidation.hasUppercase
                    ? "text-emerald-700 font-medium"
                    : "text-slate-500"
                }
              >
                At least 1 uppercase letter (A-Z)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {passwordValidation.hasNumber ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />
              )}
              <span
                className={
                  passwordValidation.hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"
                }
              >
                At least 1 number (0-9)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {passwordValidation.hasSpecial ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-1" />
              )}
              <span
                className={
                  passwordValidation.hasSpecial ? "text-emerald-700 font-medium" : "text-slate-500"
                }
              >
                At least 1 special character (!@#$...)
              </span>
            </div>

            {newPassword && confirmPassword && (
              <div className="flex items-center gap-1.5 sm:col-span-2 pt-1 border-t border-slate-200">
                {passwordValidation.matchesConfirm ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <X className="h-3.5 w-3.5 text-rose-600" />
                )}
                <span
                  className={
                    passwordValidation.matchesConfirm
                      ? "text-emerald-700 font-medium"
                      : "text-rose-600 font-medium"
                  }
                >
                  {passwordValidation.matchesConfirm
                    ? "Passwords match"
                    : "Passwords do not match"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isFormValid || changePasswordMutation.isPending}
            className="flex items-center gap-2 rounded-xl bg-[#000072] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#00005C] transition-colors disabled:opacity-40"
          >
            {changePasswordMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
}
