"use client";

import {
  X,
  Gift,
  UserCheck,
  Coins,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Calendar,
  Layers,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useReferralDetailQuery } from "../api/referrals.queries";

interface ReferralDetailModalProps {
  referralId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralDetailModal({
  referralId,
  isOpen,
  onClose,
}: ReferralDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const { data: referral, isLoading } = useReferralDetailQuery(referralId);

  if (!isOpen || !referralId) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Referral Audit Details</h3>
              <p className="text-xs text-slate-500">Inspecting referral chain and wallet ledger trail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-2" />
              <p className="text-xs text-slate-500">Loading referral transaction details...</p>
            </div>
          ) : !referral ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Unable to load referral information.
            </div>
          ) : (
            <>
              {/* Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-center shadow-2xs">
                    <span className="block text-[10px] text-[#FB7C20] font-semibold uppercase">
                      Bonus Award
                    </span>
                    <span className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1 font-mono">
                      <Coins className="h-4 w-4 text-[#FB7C20]" />
                      +{referral.rewardAmount}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600 font-medium">Status:</span>
                      {referral.rewardStatus === "earned" ? (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Earned & Credited</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Pending Activation</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Referred: {new Date(referral.referredAt).toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {referral.referralCode && (
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-xs text-slate-600 font-medium">Code:</span>
                    <span className="font-mono text-xs font-bold text-[#000072]">
                      {referral.referralCode}
                    </span>
                    <button
                      onClick={() => handleCopyCode(referral.referralCode!)}
                      className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                      title="Copy Code"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Referral Chain: Referrer -> Referred User */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                {/* Referrer Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-semibold uppercase text-[#000072] flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Referrer (Inviter)</span>
                    </span>
                    {referral.referrer?.status && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          referral.referrer.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {referral.referrer.status}
                      </span>
                    )}
                  </div>
                  {referral.referrer ? (
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-slate-900">
                        {referral.referrer.name || "Unnamed User"}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px] break-all">
                        {referral.referrer.email}
                      </p>
                      <p className="text-[10px] text-slate-400 pt-1">
                        User ID: <span className="font-mono">{referral.referrer._id}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">User account no longer exists</p>
                  )}
                </div>

                {/* Referred User Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] font-semibold uppercase text-[#FB7C20] flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Referred User (New Customer)</span>
                    </span>
                    {referral.referredUser?.status && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          referral.referredUser.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {referral.referredUser.status}
                      </span>
                    )}
                  </div>
                  {referral.referredUser ? (
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-slate-900">
                        {referral.referredUser.name || "Unnamed User"}
                      </p>
                      <p className="text-slate-500 font-mono text-[11px] break-all">
                        {referral.referredUser.email}
                      </p>
                      <p className="text-[10px] text-slate-400 pt-1">
                        User ID: <span className="font-mono">{referral.referredUser._id}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">User account not found</p>
                  )}
                </div>
              </div>

              {/* Related Activity Ledger */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Layers className="h-4 w-4 text-[#000072]" />
                  <span>Wallet Ledger Audit Trail</span>
                </div>

                {referral.relatedActivity && referral.relatedActivity.length > 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-semibold text-slate-600">
                        <tr>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Source</th>
                          <th className="py-2.5 px-3 text-right">Tokens</th>
                          <th className="py-2.5 px-3 text-right">Balance After</th>
                          <th className="py-2.5 px-3 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {referral.relatedActivity.map((tx) => (
                          <tr key={tx._id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-emerald-700 capitalize">
                              {tx.type}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 capitalize">{tx.source}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">
                              +{tx.amount}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                              {tx.balanceAfter}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-400">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-xs text-slate-400">
                    No related wallet ledger transactions linked to this referral.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
