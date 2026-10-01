import { TrendingUp, Users, DollarSign } from "lucide-react";
import { DashboardUserStatistics, DashboardRevenue } from "../types/dashboard.types";

interface GrowthChartCardProps {
  userStats?: DashboardUserStatistics;
  revenue?: DashboardRevenue;
}

export default function GrowthChartCard({ userStats, revenue }: GrowthChartCardProps) {
  const userGrowth = userStats?.growth ?? [];
  const revenueGrowth = revenue?.growth ?? [];

  const recentUserPoints = userGrowth.slice(-7);
  const recentRevenuePoints = revenueGrowth.slice(-7);

  const maxUserCount = Math.max(...recentUserPoints.map((p) => p.count), 1);
  const maxRevenueAmount = Math.max(...recentRevenuePoints.map((p) => p.revenue), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* User Growth Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#000072]/10 text-[#000072]">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">User Registration Growth</h4>
              <p className="text-xs text-slate-500">New signups across selected interval</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active Trend</span>
          </div>
        </div>

        <div className="mt-6">
          {recentUserPoints.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-xs text-slate-400">
              No registration activity recorded in this period.
            </div>
          ) : (
            <div className="flex h-36 items-end gap-3 pt-4">
              {recentUserPoints.map((item, idx) => {
                const heightPercent = Math.max(Math.round((item.count / maxUserCount) * 100), 10);
                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-700">{item.count}</span>
                    <div
                      className="w-full rounded-t-md bg-[#000072] transition-all hover:bg-[#00005C]"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="truncate text-[10px] text-slate-400 max-w-[45px]">
                      {item.date ? item.date.slice(5) : `Day ${idx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue Growth Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FB7C20]/10 text-[#FB7C20]">
              <DollarSign className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Token Pack Sales</h4>
              <p className="text-xs text-slate-500">Store purchase revenue progression</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-900">
            ${revenue?.total?.toFixed(2) ?? "0.00"} Total
          </span>
        </div>

        <div className="mt-6">
          {recentRevenuePoints.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-xs text-slate-400">
              No token package purchases recorded in this period.
            </div>
          ) : (
            <div className="flex h-36 items-end gap-3 pt-4">
              {recentRevenuePoints.map((item, idx) => {
                const heightPercent = Math.max(
                  Math.round((item.revenue / maxRevenueAmount) * 100),
                  10
                );
                return (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-700">
                      ${item.revenue}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-[#FB7C20] transition-all hover:bg-[#E86B12]"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="truncate text-[10px] text-slate-400 max-w-[45px]">
                      {item.date ? item.date.slice(5) : `Day ${idx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
