"use client";

import { useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ReportsQueryParams } from "../types/reports.types";
import { useReportsQuery } from "../api/reports.queries";
import ReportsFilterBar from "./reports-filter-bar";
import RevenueAnalyticsCard from "./revenue-analytics-card";
import TokensAnalyticsCard from "./tokens-analytics-card";
import AIUsageCard from "./ai-usage-card";
import UsersAnalyticsCard from "./users-analytics-card";
import AffiliateClicksCard from "./affiliate-clicks-card";

export default function ReportsManagement() {
  const [filters, setFilters] = useState<ReportsQueryParams>({
    period: "monthly",
    granularity: "day",
    type: "all",
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useReportsQuery(filters);

  const handleFilterChange = (updated: Partial<ReportsQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Analytics & Executive Reports</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#000072] border border-blue-100">
              Audit Intelligence
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate reports on customer wallets, token burning, conversational AI workload, and revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh analytics"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Filter and Period Selector */}
      <ReportsFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Error Alert */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>
              {error instanceof Error ? error.message : "Failed to load executive reports."}
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

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
          <p className="text-sm font-medium text-slate-500">Aggregating multi-source analytics...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Revenue & Purchases */}
          <RevenueAnalyticsCard data={data.revenue} />

          {/* Token Economy & Top Spenders */}
          <TokensAnalyticsCard data={data.tokens} />

          {/* AI Usage & Workload */}
          {/* <AIUsageCard data={data.ai} /> */}

          {/* User Demographics & Signups */}
          <UsersAnalyticsCard data={data.users} />

          {/* Affiliate Outbound Clicks */}
          {/* <AffiliateClicksCard data={data.clicks} /> */}
        </div>
      ) : null}
    </div>
  );
}
