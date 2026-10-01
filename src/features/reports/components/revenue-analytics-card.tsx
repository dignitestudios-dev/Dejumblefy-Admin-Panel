"use client";

import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from "lucide-react";
import { RevenueReportData } from "../types/reports.types";

interface RevenueAnalyticsCardProps {
  data?: RevenueReportData;
}

export default function RevenueAnalyticsCard({ data }: RevenueAnalyticsCardProps) {
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Revenue & Orders</h3>
            <p className="text-[11px] text-slate-500">Token pack checkout monetization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Total Gross Revenue */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <CreditCard className="h-3 w-3 text-emerald-600" />
            <span>Total Revenue</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-emerald-600 font-mono">
            ${Number(data.totalRevenue || 0).toFixed(2)}
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <ShoppingCart className="h-3 w-3 text-[#000072]" />
            <span>Orders / Packs</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {data.transactionsCount || 0}
          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <TrendingUp className="h-3 w-3 text-[#FB7C20]" />
            <span>Avg Order Value</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-[#FB7C20] font-mono">
            ${Number(data.averageOrderValue || 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
