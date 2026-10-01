"use client";

import { useState, useEffect } from "react";
import { Coins, X, Loader2, AlertCircle, PlusCircle, MinusCircle, ArrowRight } from "lucide-react";
import { AdminUserListItem } from "../types/users.types";
import { useAdjustTokensMutation } from "../api/users.mutations";

interface AdjustTokensModalProps {
  user: AdminUserListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdjustTokensModal({
  user,
  isOpen,
  onClose,
}: AdjustTokensModalProps) {
  const [mode, setMode] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adjustMutation = useAdjustTokensMutation();

  useEffect(() => {
    if (isOpen) {
      setMode("credit");
      setAmount("");
      setNote("");
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const numericAmount = typeof amount === "number" ? amount : 0;
  const signedDelta = mode === "credit" ? numericAmount : -numericAmount;
  const projectedBalance = Math.max(0, user.tokenBalance + signedDelta);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (amount === "" || numericAmount <= 0) {
      setErrorMessage("Please enter an amount greater than 0.");
      return;
    }

    if (!note.trim()) {
      setErrorMessage("Please provide an administrative audit note for this ledger entry.");
      return;
    }

    try {
      await adjustMutation.mutateAsync({
        id: user._id,
        payload: {
          amount: signedDelta,
          note: note.trim(),
        },
      });
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Failed to adjust token balance."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Adjust Token Balance</h3>
              <p className="text-xs text-slate-500">Record a manual administrative ledger transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
          <div>
            <div className="font-semibold text-slate-900">{user.name || "Unnamed User"}</div>
            <div className="text-[11px] text-slate-500">{user.email}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-slate-400">Current Balance</div>
            <div className="font-mono font-bold text-slate-900 text-sm">
              {user.tokenBalance.toLocaleString()} tokens
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Credit vs Debit Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("credit")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                mode === "credit"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Credit (Add)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("debit")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                mode === "debit"
                  ? "border-rose-600 bg-rose-50 text-rose-700 shadow-2xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MinusCircle className="h-3.5 w-3.5" />
              <span>Debit (Deduct)</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Token Quantity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 100"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Audit Reason / Note <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Compensation for AI query timeout / customer support request"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>

          {/* Balance Preview */}
          {numericAmount > 0 && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3 flex items-center justify-between text-xs">
              <span className="text-slate-600">Projected Balance:</span>
              <div className="flex items-center gap-2 font-mono font-bold">
                <span className="text-slate-500">{user.tokenBalance}</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className={mode === "credit" ? "text-emerald-700" : "text-rose-700"}>
                  {projectedBalance.toLocaleString()} tokens
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adjustMutation.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#000072] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#00005C] transition-colors disabled:opacity-50"
            >
              {adjustMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm Adjustment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
