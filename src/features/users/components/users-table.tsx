"use client";

import { useState } from "react";
import {
  Coins,
  ShieldAlert,
  ShieldCheck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Gift,
  Clock,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { AdminUserListItem } from "../types/users.types";
import { useToggleBlockUserMutation } from "../api/users.mutations";

interface UsersTableProps {
  users: AdminUserListItem[];
  isLoading: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange: (newPage: number) => void;
  onInspect: (user: AdminUserListItem) => void;
}

function UserAvatar({ user }: { user: AdminUserListItem }) {
  const [imageError, setImageError] = useState(false);
  const initials = user.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user.email
    ? user.email[0].toUpperCase()
    : "U";

  const pictureUrl = user.profilePicture?.location;

  if (pictureUrl && !imageError) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-2xs">
        <img
          src={pictureUrl}
          alt={user.name || user.email}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#000072]/10 text-sm font-bold text-[#000072] border border-[#000072]/20">
      {initials}
    </div>
  );
}

export default function UsersTable({
  users,
  isLoading,
  pagination,
  onPageChange,
  onInspect,
}: UsersTableProps) {
  const toggleBlockMutation = useToggleBlockUserMutation();

  const handleToggleBlock = async (user: AdminUserListItem) => {
    const newToggleState = !user.isDeactivatedByAdmin;
    await toggleBlockMutation.mutateAsync({
      id: user._id,
      payload: { toggle: newToggleState },
    });
  };

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "—";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStatusBadge = (user: AdminUserListItem) => {
    const isSuspended = user.isDeactivatedByAdmin || user.status === "suspended";
    const isPending = user.status === "pending" || user.isEmailVerified === false;

    if (isSuspended) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Suspended
        </span>
      );
    }

    if (isPending) {
      return (
        <span
          title="Pending Email OTP Verification"
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200"
        >
          <Clock className="h-3 w-3 text-amber-600" />
          Pending
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">User Account</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Token Balance</th>
              <th className="px-6 py-4">Referral Details</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-[#FB7C20]" />
                    <span>Loading users from database...</span>
                  </div>
                </td>
              </tr>
            ) : !users || users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8">
                  <EmptyState
                    title="No users found"
                    description="No user accounts match your active search and filter criteria."
                  />
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const dateString = user.registeredAt || user.createdAt;
                return (
                  <tr key={user._id} className="transition-colors hover:bg-slate-50/80">
                    {/* User info & Profile Picture */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div className="overflow-hidden max-w-[200px]">
                          <div className="font-bold text-slate-900 truncate text-sm">
                            {user.name || "Unnamed User"}
                          </div>
                          <div className="text-slate-500 truncate text-[11px]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">{renderStatusBadge(user)}</td>

                    {/* Token balance */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#FB7C20]/20 bg-[#FB7C20]/10 px-2.5 py-1 font-bold text-[#FB7C20]">
                        <Coins className="h-3.5 w-3.5" />
                        <span>{user.tokenBalance ?? 0}</span>
                      </div>
                    </td>

                    {/* Referral info (Code & ReferredBy) */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Code:</span>
                          <span className="font-mono text-xs font-semibold text-slate-800">
                            {user.referralCode || "—"}
                          </span>
                        </div>
                        {user.referredBy ? (
                          <div
                            className="flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 max-w-fit"
                            title={`Referred by ${user.referredBy.name || user.referredBy.email} (${user.referredBy.email})`}
                          >
                            <Gift className="h-3 w-3 text-teal-600 shrink-0" />
                            <span className="truncate max-w-[130px]">
                              by {user.referredBy.name || user.referredBy.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Direct signup</span>
                        )}
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDate(dateString)}
                    </td>

                    {/* Actions: Only View and Suspend/Unban */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onInspect(user)}
                          title="View User Details"
                          aria-label={`View details for ${user.name || user.email}`}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-[#000072]/10 hover:text-[#000072] hover:border-[#000072]/30 transition-colors shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#000072]" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user)}
                          disabled={toggleBlockMutation.isPending}
                          title={user.isDeactivatedByAdmin ? "Unban Account" : "Suspend Account"}
                          aria-label={user.isDeactivatedByAdmin ? "Unban account" : "Suspend account"}
                          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors shadow-2xs ${
                            user.isDeactivatedByAdmin
                              ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              : "border-amber-200 bg-amber-50/60 text-amber-800 hover:bg-amber-100"
                          }`}
                        >
                          {user.isDeactivatedByAdmin ? (
                            <>
                              <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                              <span>Unban</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                              <span>Suspend</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-6 py-4 text-xs text-slate-600">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{pagination.totalItems}</span> accounts
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
