"use client";

import { useState } from "react";
import {
  Coins,
  Cpu,
  Gift,
  X,
  Loader2,
  Shield,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";
import { useUserDetailQuery, useUserLedgerQuery, useUserActivityQuery } from "../api/users.queries";
import { UserActivityType } from "../types/users.types";

interface UserDetailModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "ledger" | "activity">("overview");
  const [activityType, setActivityType] = useState<UserActivityType | undefined>(undefined);

  const { data: user, isLoading: isUserLoading } = useUserDetailQuery(userId);
  const { data: ledgerData, isLoading: isLedgerLoading } = useUserLedgerQuery(userId, {
    limit: 15,
  });
  const { data: activityData, isLoading: isActivityLoading } = useUserActivityQuery(
    userId,
    activeTab === "activity" ? { type: activityType, limit: 30 } : undefined
  );

  if (!isOpen || !userId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#000072]/10 text-[#000072] border border-[#000072]/20 font-bold text-lg">
              {user?.name ? user.name[0].toUpperCase() : user?.email[0].toUpperCase() || "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{user?.name || "Unnamed User"}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                    user?.isDeactivatedByAdmin
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {user?.isDeactivatedByAdmin ? "Suspended" : "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close user details modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white">
          <button
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "overview"
                ? "border-[#FB7C20] text-[#FB7C20]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Overview & AI Usage
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "ledger"
                ? "border-[#FB7C20] text-[#FB7C20]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Token Ledger
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === "activity"
                ? "border-[#FB7C20] text-[#FB7C20]"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Activity Timeline
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isUserLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#FB7C20]" />
            </div>
          ) : !user ? (
            <div className="text-center text-xs text-slate-400">User details not found.</div>
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
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                      {user.referredBy?.name || user.referredBy?.email || "None"}
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

              {/* AI Usage Breakdown */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-[#000072]" />
                  <h4 className="font-bold text-slate-900 text-xs">AI Chat & Declutter Activity</h4>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                    <div className="text-base font-bold text-slate-900">
                      {user.aiUsage?.chatsCount ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">Chats Created</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                    <div className="text-base font-bold text-slate-900">
                      {user.aiUsage?.messagesCount ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">Replies Received</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                    <div className="text-base font-bold text-slate-900">
                      {user.aiUsage?.imagesCount ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">AI Images</div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "ledger" ? (
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
          ) : (
            /* Activity Timeline Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-[#000072]" /> Activity Stream
                </span>
                <select
                  value={activityType || ""}
                  onChange={(e) =>
                    setActivityType((e.target.value as UserActivityType) || undefined)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
                >
                  <option value="">All Activities</option>
                  <option value="logins">Logins</option>
                  <option value="uploads">Uploads</option>
                  <option value="purchases">Purchases</option>
                  <option value="usage">Usage</option>
                  <option value="transactions">Transactions</option>
                  <option value="ai">AI Chats</option>
                  <option value="referrals">Referrals</option>
                </select>
              </div>

              {isActivityLoading ? (
                <div className="flex h-36 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#FB7C20]" />
                </div>
              ) : !activityData?.items?.length ? (
                <div className="text-center py-8 text-xs text-slate-400 rounded-xl border border-slate-200 bg-slate-50">
                  No activity events found for the selected filter.
                </div>
              ) : (
                <div className="space-y-2">
                  {activityData.items.map((act) => (
                    <div
                      key={act._id}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-1 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[#000072]/10 border border-[#000072]/20 px-2 py-0.5 text-[10px] font-bold text-[#000072] uppercase tracking-wider">
                            {act.type || "event"}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {act.action || act.description || "Activity logged"}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {act.createdAt ? new Date(act.createdAt).toLocaleString() : ""}
                        </span>
                      </div>

                      {act.description && act.action && act.description !== act.action && (
                        <p className="text-[11px] text-slate-600 pl-1">{act.description}</p>
                      )}

                      {(act.ip || act.userAgent) && (
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 pt-1 font-mono">
                          {act.ip && <span>IP: {act.ip}</span>}
                          {act.userAgent && (
                            <span className="truncate max-w-[200px]" title={act.userAgent}>
                              Agent: {act.userAgent}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
