"use client";

import {
  Coins,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Gift,
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
  onAdjustTokens: (user: AdminUserListItem) => void;
  onEdit: (user: AdminUserListItem) => void;
  onDelete: (user: AdminUserListItem) => void;
}

export default function UsersTable({
  users,
  isLoading,
  pagination,
  onPageChange,
  onInspect,
  onAdjustTokens,
  onEdit,
  onDelete,
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

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">User Account</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Token Balance</th>
              <th className="px-6 py-4">Referral Code</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Quick Actions</th>
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
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#000072]/10 text-sm font-bold text-[#000072] border border-[#000072]/20">
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden max-w-[200px]">
                          <div className="font-bold text-slate-900 truncate text-sm">
                            {user.name || "Unnamed"}
                          </div>
                          <div className="text-slate-500 truncate text-[11px]">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                          user.isDeactivatedByAdmin
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isDeactivatedByAdmin ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                        />
                        {user.isDeactivatedByAdmin ? "Suspended" : "Active"}
                      </span>
                    </td>

                    {/* Token balance */}
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#FB7C20]/20 bg-[#FB7C20]/10 px-2.5 py-1 font-bold text-[#FB7C20]">
                        <Coins className="h-3.5 w-3.5" />
                        <span>{user.tokenBalance ?? 0}</span>
                      </div>
                    </td>

                    {/* Referral info */}
                    <td className="px-6 py-4">
                      <div className="space-y-0.5">
                        <span className="font-mono text-xs font-semibold text-slate-800">
                          {user.referralCode || "—"}
                        </span>
                        {user.referredBy && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Gift className="h-3 w-3 text-teal-600" />
                            <span className="truncate max-w-[120px]">
                              ref: {user.referredBy.name || user.referredBy.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDate(dateString)}
                    </td>

                    {/* Quick actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onInspect(user)}
                          title="View Details"
                          aria-label={`View details for ${user.name || user.email}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-[#000072]/10 hover:text-[#000072] transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAdjustTokens(user)}
                          title="Adjust Tokens"
                          aria-label={`Adjust tokens for ${user.name || user.email}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-[#FB7C20]/10 hover:text-[#FB7C20] transition-colors"
                        >
                          <Coins className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          title="Edit Profile"
                          aria-label={`Edit profile for ${user.name || user.email}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user)}
                          title={user.isDeactivatedByAdmin ? "Unban Account" : "Suspend Account"}
                          aria-label={user.isDeactivatedByAdmin ? "Unban account" : "Suspend account"}
                          className={`rounded-lg p-1.5 transition-colors ${
                            user.isDeactivatedByAdmin
                              ? "text-rose-600 hover:bg-rose-50"
                              : "text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          }`}
                        >
                          {user.isDeactivatedByAdmin ? (
                            <ShieldAlert className="h-4 w-4" />
                          ) : (
                            <ShieldCheck className="h-4 w-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          title="Delete User"
                          aria-label={`Delete user ${user.name || user.email}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
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
