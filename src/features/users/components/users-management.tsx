"use client";

import { useState } from "react";
import { Users, AlertCircle } from "lucide-react";
import { useUsersQuery } from "../api/users.queries";
import { AdminUserListItem, UsersQueryParams } from "../types/users.types";
import UsersFilterBar from "./users-filter-bar";
import UsersTable from "./users-table";
import AdjustTokensModal from "./adjust-tokens-modal";
import EditUserModal from "./edit-user-modal";
import DeleteUserModal from "./delete-user-modal";
import UserDetailModal from "./user-detail-modal";

export default function UsersManagement() {
  const [filters, setFilters] = useState<UsersQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [inspectUser, setInspectUser] = useState<AdminUserListItem | null>(null);
  const [adjustUser, setAdjustUser] = useState<AdminUserListItem | null>(null);
  const [editUser, setEditUser] = useState<AdminUserListItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUserListItem | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useUsersQuery(filters);

  const users = data?.data?.users || [];
  const pagination = data?.pagination;

  const handleFilterChange = (updated: Partial<UsersQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            User Accounts & Token Balances
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Inspect customer wallets, manual token adjustments, referral chains, and ban statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs">
            <Users className="h-4 w-4 text-[#000072]" />
            <span>Total Accounts: {pagination?.totalItems ?? users.length}</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>{error instanceof Error ? error.message : "Unable to load user accounts."}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <UsersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {/* Main Users Table */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={(page) => handleFilterChange({ page })}
        onInspect={(u) => setInspectUser(u)}
        onAdjustTokens={(u) => setAdjustUser(u)}
        onEdit={(u) => setEditUser(u)}
        onDelete={(u) => setDeleteUser(u)}
      />

      {/* Modals */}
      <UserDetailModal
        userId={inspectUser?._id || null}
        isOpen={!!inspectUser}
        onClose={() => setInspectUser(null)}
      />

      <AdjustTokensModal
        user={adjustUser}
        isOpen={!!adjustUser}
        onClose={() => setAdjustUser(null)}
      />

      <EditUserModal user={editUser} isOpen={!!editUser} onClose={() => setEditUser(null)} />

      <DeleteUserModal
        user={deleteUser}
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
      />
    </div>
  );
}
