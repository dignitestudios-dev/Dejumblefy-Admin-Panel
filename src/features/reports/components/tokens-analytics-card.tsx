"use client";

import { Coins, ArrowDownRight, ArrowUpRight, RotateCcw, Gift, Award } from "lucide-react";
import { TokenReportData } from "../types/reports.types";

interface TokensAnalyticsCardProps {
  data?: TokenReportData;
}

export default function TokensAnalyticsCard({ data }: TokensAnalyticsCardProps) {
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
            <Coins className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Token Economy & Consumption</h3>
            <p className="text-[11px] text-slate-500">Minted, consumed, and circulating balance</p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          Unused in Wallets: <span className="font-bold text-slate-900 font-mono">{data.totalUnusedTokens || 0}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <ArrowDownRight className="h-3 w-3" />
            <span>Purchased</span>
          </span>
          <div className="mt-1 text-xl font-bold text-emerald-700 font-mono">
            +{data.totalTokensPurchased || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-rose-700 flex items-center justify-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>Spent on AI</span>
          </span>
          <div className="mt-1 text-xl font-bold text-rose-700 font-mono">
            -{data.totalTokensSpent || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-[#000072] flex items-center justify-center gap-1">
            <RotateCcw className="h-3 w-3" />
            <span>AI Refunds</span>
          </span>
          <div className="mt-1 text-xl font-bold text-[#000072] font-mono">
            +{data.totalTokensRefundedForFailures || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-[#FB7C20] flex items-center justify-center gap-1">
            <Coins className="h-3 w-3" />
            <span>Net Tokens Used</span>
          </span>
          <div className="mt-1 text-xl font-bold text-[#FB7C20] font-mono">
            {data.totalTokensUsed || 0}
          </div>
        </div>
      </div>

      {/* Incentives Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <Gift className="h-3.5 w-3.5 text-[#000072]" />
            <span>Signup Bonuses:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">+{data.totalTokensFromSignupBonus || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#000072]" />
            <span>Referral Rewards:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">+{data.totalTokensFromReferrals || 0}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <Coins className="h-3.5 w-3.5 text-[#FB7C20]" />
            <span>Admin Adjustments:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">+{data.totalTokensAdminCredited || 0}</span>
        </div>
      </div>

      {/* Top Spenders Table */}
      {data.topSpenders && data.topSpenders.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-700">Top Token Consumers</span>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3 text-right">Tokens Consumed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topSpenders.slice(0, 5).map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-[150px]">
                      {user.name || "Customer"}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500 text-[11px] truncate max-w-[180px]">
                      {user.email}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#FB7C20]">
                      {user.tokensSpent ?? user.tokens ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
