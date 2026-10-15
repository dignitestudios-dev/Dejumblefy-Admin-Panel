"use client";

import { useState } from "react";
import {
  Coins,
  Gift,
  X,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useUserDetailQuery, useUserLedgerQuery } from "../api/users.queries";
import { useToggleBlockUserMutation } from "../api/users.mutations";

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ledger">("overview");

  const { data: user, isLoading: isUserLoading } = useUserDetailQuery(userId);
  const { data: ledgerData, isLoading: isLedgerLoading } = useUserLedgerQuery(userId, {
    limit: 20,
  });
  const toggleBlockMutation = useToggleBlockUserMutation();

  if (!isOpen || !userId) return null;

  const isSuspended = user?.isDeactivatedByAdmin || user?.status === "suspended";

  const handleToggleBlock = async () => {
    if (!user) return;
    const newToggleState = !user.isDeactivatedByAdmin;
    await toggleBlockMutation.mutateAsync({
      id: user._id,
      payload: { toggle: newToggleState },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 bg-slate-50/50">
          <div className="flex items-center gap-3">
            {user?.profilePicture?.location ? (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src={user.profilePicture.location}
                  alt={user.name || user.email || "User avatar"}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000072]/10 text-[#000072] border border-[#000072]/20 font-bold text-lg">
                {user?.name ? user.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{user?.name || "Unnamed User"}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    isSuspended
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : user?.status === "pending" || user?.isEmailVerified === false
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {isSuspended
                    ? "Suspended"
                    : user?.status === "pending" || user?.isEmailVerified === false
                    ? "Pending Verification"
                    : "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close user details modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white">
          <button
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-[#FB7C20] text-[#FB7C20]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & Balances
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "ledger"
                ? "border-[#FB7C20] text-[#FB7C20]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Token Ledger
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isUserLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#FB7C20]" />
            </div>
          ) : !user ? (
            <div className="text-center text-xs text-slate-400 py-12">User details not found.</div>
          ) : activeTab === "overview" ? (
            <>
              {/* Quick Stat Pill Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Coins className="h-3.5 w-3.5 text-[#FB7C20]" />
                    <span>Token Balance</span>
                  </div>
                  <div className="mt-1.5 text-xl font-bold text-[#FB7C20]">
                    {user.tokenBalance ?? 0}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Gift className="h-3.5 w-3.5 text-teal-600" />
                    <span>Referrals</span>
                  </div>
                  <div className="mt-1.5 text-xl font-bold text-slate-900">
                    {user.totalReferrals ?? 0}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Shield className="h-3.5 w-3.5 text-[#000072]" />
                    <span>Referral Code</span>
                  </div>
                  <div className="mt-1.5 font-mono text-sm font-bold text-slate-900">
                    {user.referralCode || "N/A"}
                  </div>
                </div>
              </div>

              {/* Account Details Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-xs">
                <h4 className="font-bold text-slate-900 text-xs">Account Information</h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-1">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Email Verified:</span>
                    <span className="font-medium text-slate-800">
                      {user.isEmailVerified ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <XCircle className="h-3.5 w-3.5" /> Unverified
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Profile Setup:</span>
                    <span className="font-medium text-slate-800">
                      {user.isProfileCompleted ? "Completed" : "Incomplete"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Referred By:</span>
                    <span className="font-medium text-slate-800">
                      {user.referredBy
                        ? user.referredBy.name
                          ? `${user.referredBy.name} (${user.referredBy.email})`
                          : user.referredBy.email
                        : "Direct signup (None)"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Joined At:</span>
                    <span className="font-medium text-slate-800">
                      {user.registeredAt || user.createdAt
                        ? new Date(user.registeredAt || user.createdAt!).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Ledger Tab */
            <div className="space-y-3">
              {isLedgerLoading ? (
                <div className="flex h-36 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#FB7C20]" />
                </div>
              ) : !ledgerData?.data?.length ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No token transactions recorded for this user yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {ledgerData.data.map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3.5 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              item.type === "credit" ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {item.amount > 0 ? `+${item.amount}` : item.amount} Tokens
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 capitalize">
                            {item.source?.replace(/_/g, " ")}
                          </span>
                        </div>
                        {item.note && (
                          <p className="mt-0.5 text-[11px] text-slate-500">{item.note}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-slate-800">
                          Balance: {item.balanceAfter}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with only Suspend/Block/Unban capability & Close */}
        <div className="border-t border-slate-200 p-4 flex items-center justify-between bg-slate-50/50">
          <div>
            {user && (
              <button
                type="button"
                onClick={handleToggleBlock}
                disabled={toggleBlockMutation.isPending}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isSuspended
                    ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                {toggleBlockMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSuspended ? (
                  <ShieldAlert className="h-4 w-4 text-rose-600" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-amber-700" />
                )}
                <span>{isSuspended ? "Unban Account" : "Suspend Account"}</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
