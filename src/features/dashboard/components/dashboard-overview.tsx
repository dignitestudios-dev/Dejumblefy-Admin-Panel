"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  Coins,
  Gift,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useDashboardQuery } from "../api/dashboard.queries";
import { DashboardPeriod } from "../types/dashboard.types";
import StatCard from "./stat-card";
import AIUsageCard from "./ai-usage-card";
import GrowthChartCard from "./growth-chart-card";
import QuickActionsCard from "./quick-actions-card";

const PERIODS: Array<{ label: string; value: DashboardPeriod }> = [
  { label: "Today", value: "daily" },
  { label: "7 Days", value: "weekly" },
  { label: "30 Days", value: "monthly" },
  { label: "1 Year", value: "yearly" },
];

export default function DashboardOverview() {
  const [period, setPeriod] = useState<DashboardPeriod>("monthly");
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardQuery({ period });

  const overview = data?.overview;
  const userStats = data?.userStatistics;
  const aiUsage = data?.aiUsage;
  const revenue = data?.revenue;

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Welcome To Admin Panel
          </h2>
        
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {PERIODS.map((item) => (
              <button
                key={item.value}
                onClick={() => setPeriod(item.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  period === item.value
                    ? "bg-[#000072] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh Metrics"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>
              {error instanceof Error
                ? error.message
                : "Unable to retrieve dashboard metrics from server."}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Users"
          value={isLoading ? "..." : (overview?.totalUsers ?? 0).toLocaleString()}
          subtitle={`${userStats?.activeUsers ?? 0} active in ${period}`}
          icon={Users}
          trend={{
            value: `+${userStats?.newUsers ?? 0} new`,
            isPositive: true,
          }}
        />

        <StatCard
          title="Gross Store Revenue"
          value={
            isLoading ? "..." : `$${(overview?.totalRevenue ?? revenue?.total ?? 0).toFixed(2)}`
          }
          subtitle={`$${(revenue?.monthly ?? 0).toFixed(2)} this month`}
          icon={DollarSign}
          trend={{
            value: `$${revenue?.inRange ?? 0} in range`,
            isPositive: true,
          }}
        />

        <StatCard
          title="Tokens In Circulation"
          value={isLoading ? "..." : (overview?.totalTokensPurchased ?? 0).toLocaleString()}
          subtitle={`${overview?.totalTokensUsed ?? 0} used for AI replies`}
          icon={Coins}
        />

        <StatCard
          title="Referral Program"
          value={isLoading ? "..." : (overview?.totalReferrals ?? 0).toLocaleString()}
          subtitle={`${overview?.successfulReferrals ?? 0} rewarded conversions`}
          icon={Gift}
        />
      </div>

      {/* AI Telemetry */}
      <AIUsageCard data={aiUsage} />

      {/* Visual Growth Graphs */}
      <GrowthChartCard userStats={userStats} revenue={revenue} />

      {/* Quick Access to Main Admin Sections */}
      <QuickActionsCard />
    </div>
  );
}
