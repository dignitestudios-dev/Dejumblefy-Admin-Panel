"use client";

import {
  Gift,
  Coins,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ReferralItem } from "../types/referrals.types";

interface ReferralsTableProps {
  referrals: ReferralItem[];
  isLoading: boolean;
  onInspect: (referralId: string) => void;
}

export default function ReferralsTable({
  referrals,
  isLoading,
  onInspect,
}: ReferralsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading referral records...</p>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <EmptyState
        title="No referrals found"
        description="No referral conversions match your filter criteria or search query."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Referrer (Inviter)</th>
              <th className="py-3 px-4">Referral Code</th>
              <th className="py-3 px-4">Referred Customer</th>
              <th className="py-3 px-4 text-center">Reward</th>
              <th className="py-3 px-4 text-center">Reward Status</th>
              <th className="py-3 px-4">Date Joined</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referrals.map((item) => (
              <tr
                key={item._id}
                className="group transition-colors hover:bg-slate-50/70"
              >
                {/* Referrer */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#000072] border border-blue-100 text-xs font-bold uppercase">
                      {item.referrer?.name ? item.referrer.name.charAt(0) : "U"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-900 group-hover:text-[#FB7C20] transition-colors truncate">
                        {item.referrer?.name || "Unnamed User"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 truncate">
                        {item.referrer?.email || "No email"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Referral Code */}
                <td className="py-3 px-4">
                  {item.referralCode ? (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-[#000072] border border-blue-100">
                      {item.referralCode}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </td>

                {/* Referred User */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase">
                      {item.referredUser?.name ? item.referredUser.name.charAt(0) : "U"}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-900 truncate">
                        {item.referredUser?.name || "New Customer"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 truncate">
                        {item.referredUser?.email || "No email"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Reward Amount */}
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#FB7C20] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    <Coins className="h-3 w-3" />
                    +{item.rewardAmount}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-4 text-center">
                  {item.rewardStatus === "earned" ? (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Earned</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="h-3 w-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                  {item.referredAt
                    ? new Date(item.referredAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onInspect(item._id)}
                    title="Audit Referral Trail"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5 text-[#000072]" />
                    <span>Audit</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
