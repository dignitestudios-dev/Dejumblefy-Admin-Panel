"use client";

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Coins,
  RotateCcw,
  Calendar,
  Package,
} from "lucide-react";
import { RevenueReportData } from "../types/reports.types";

interface RevenueAnalyticsCardProps {
  data?: RevenueReportData;
}

export default function RevenueAnalyticsCard({ data }: RevenueAnalyticsCardProps) {
  if (!data) return null;

  const totalRevenue = Number(data.totalRevenue || 0);
  const netRevenue = Number(data.netRevenue !== undefined ? data.netRevenue : totalRevenue);
  const tokenPurchases = data.tokenPurchases ?? data.transactionsCount ?? 0;
  const tokensSold = data.tokensSold ?? 0;
  const monthlyRevenue = Number(data.monthlyRevenue || 0);
  const yearlyRevenue = Number(data.yearlyRevenue || 0);
  const refundedRevenue = Number(data.refundedRevenue || 0);
  const refundedPurchases = data.refundedPurchases || 0;

  const averageOrderValue =
    data.averageOrderValue !== undefined
      ? Number(data.averageOrderValue)
      : tokenPurchases > 0
        ? totalRevenue / tokenPurchases
        : 0;

  const packages = data.revenueByPackage ?? [];
  const growth = data.growth ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Revenue & Monetization</h3>
            <p className="text-[11px] text-slate-500">
              Token pack checkout revenue, orders, and refund tracking
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
          Net Revenue: <span className="font-bold text-emerald-700 font-mono">${netRevenue.toFixed(2)}</span>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {/* Gross Revenue */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <CreditCard className="h-3 w-3 text-emerald-600" />
            <span>Gross Revenue</span>
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-600 font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
        </div>

        {/* Net Revenue */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <DollarSign className="h-3 w-3 text-emerald-700" />
            <span>Net Revenue</span>
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-emerald-700 font-mono">
            ${netRevenue.toFixed(2)}
          </div>
        </div>

        {/* Token Orders */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <ShoppingCart className="h-3 w-3 text-[#000072]" />
            <span>Token Orders</span>
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {tokenPurchases}
          </div>
        </div>

        {/* Tokens Sold */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Coins className="h-3 w-3 text-[#FB7C20]" />
            <span>Tokens Sold</span>
          </span>
          <div className="mt-1 text-xl sm:text-2xl font-bold text-[#FB7C20] font-mono">
            {tokensSold.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sub-Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#000072]" />
            <span>Monthly:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">${monthlyRevenue.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span>Yearly:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">${yearlyRevenue.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#FB7C20]" />
            <span>Avg Order:</span>
          </span>
          <span className="font-mono font-bold text-slate-900">${averageOrderValue.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-600 flex items-center gap-1.5">
            <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
            <span>Refunds:</span>
          </span>
          <span className="font-mono font-bold text-rose-600">
            -${refundedRevenue.toFixed(2)} ({refundedPurchases})
          </span>
        </div>
      </div>

      {/* Package Breakdown Table if data exists */}
      {packages.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-[#000072]" />
            <span>Revenue by Package</span>
          </span>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Package</th>
                  <th className="py-2.5 px-3 text-center">Tokens</th>
                  <th className="py-2.5 px-3 text-center">Purchases</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {packages.map((pkg, idx) => (
                  <tr key={pkg.packageId || idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {pkg.packageName || pkg.name || `Package #${idx + 1}`}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                      {(pkg.tokens || 0).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                      {pkg.purchases ?? pkg.count ?? 0}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                      ${Number(pkg.revenue ?? pkg.totalRevenue ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Growth Breakdown if data exists */}
      {growth.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            <span>Revenue Growth</span>
          </span>
          <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-2xs">
            {growth.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-600">{item.date || item.period}</span>
                <span className="font-mono font-bold text-emerald-600">
                  ${Number(item.revenue || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
