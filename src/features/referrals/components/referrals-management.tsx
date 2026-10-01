"use client";

import { useState, useMemo } from "react";
import {
  Gift,
  Coins,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Share2,
} from "lucide-react";
import { ReferralsQueryParams } from "../types/referrals.types";
import { useReferralsQuery } from "../api/referrals.queries";
import ReferralsFilterBar from "./referrals-filter-bar";
import ReferralsTable from "./referrals-table";
import ReferralDetailModal from "./referral-detail-modal";

export default function ReferralsManagement() {
  const [filters, setFilters] = useState<ReferralsQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
  });

  const [inspectReferralId, setInspectReferralId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useReferralsQuery(filters);

  const referrals = data?.data?.referrals || [];
  const pagination = data?.pagination;

  const totalItems = pagination?.totalItems ?? referrals.length;

  const handleFilterChange = (updated: Partial<ReferralsQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      status: "all",
      startDate: undefined,
      endDate: undefined,
    });
  };

  // Quick stats computed from current view
  const earnedCount = useMemo(
    () => referrals.filter((r) => r.rewardStatus === "earned").length,
    [referrals]
  );
  const totalTokensDistributed = useMemo(
    () =>
      referrals
        .filter((r) => r.rewardStatus === "earned")
        .reduce((acc, curr) => acc + (curr.rewardAmount || 0), 0),
    [referrals]
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Referral Monitoring</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#000072] border border-blue-100">
              Growth & Invitations
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track user referral chains, verify bonus token payouts, and inspect fraud-resistant invite codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh referrals"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Total Referrals */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Referrals</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#000072]">
              <Share2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{totalItems}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total account signups via invite codes</p>
        </div>

        {/* Card 2: Earned Rewards */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Earned Conversions</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            {earnedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Successfully claimed and credited</p>
        </div>

        {/* Card 3: Tokens Awarded */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tokens Awarded</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#FB7C20]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#FB7C20] font-mono">
            +{totalTokensDistributed}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Incentive tokens granted to referrers</p>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>
              {error instanceof Error ? error.message : "Failed to load referral transactions."}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <ReferralsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <ReferralsTable
        referrals={referrals}
        isLoading={isLoading}
        onInspect={(id) => setInspectReferralId(id)}
      />

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
            <span className="font-semibold text-slate-900">{pagination.totalPages}</span> (
            {pagination.totalItems} referrals total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page || 1) - 1),
                }))
              }
              disabled={pagination.page <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: Math.min(pagination.totalPages, (prev.page || 1) + 1),
                }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ReferralDetailModal
        referralId={inspectReferralId}
        isOpen={!!inspectReferralId}
        onClose={() => setInspectReferralId(null)}
      />
    </div>
  );
}
