"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { ReportPeriod, ReportGranularity, ReportsQueryParams, ReportSectionType } from "../types/reports.types";
import { exportReportCsv } from "../api/reports.api";

interface ReportsFilterBarProps {
  filters: ReportsQueryParams;
  onFilterChange: (updated: Partial<ReportsQueryParams>) => void;
}

export default function ReportsFilterBar({
  filters,
  onFilterChange,
}: ReportsFilterBarProps) {
  const [exportType, setExportType] = useState<ReportSectionType>("tokens");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportReportCsv({
        ...filters,
        type: exportType === "all" ? "tokens" : exportType,
      });
    } catch {
      // Handled
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Period Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          {(
            [
              { id: "daily" as ReportPeriod, label: "Daily (24h)" },
              { id: "weekly" as ReportPeriod, label: "Weekly" },
              { id: "monthly" as ReportPeriod, label: "Monthly" },
              { id: "yearly" as ReportPeriod, label: "Yearly" },
              { id: "custom" as ReportPeriod, label: "Custom Range" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ period: tab.id })}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                filters.period === tab.id
                  ? "bg-[#000072] text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Granularity & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Granularity */}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Interval:</span>
            <select
              value={filters.granularity || "day"}
              onChange={(e) =>
                onFilterChange({ granularity: e.target.value as ReportGranularity })
              }
              className="bg-transparent text-slate-800 font-semibold focus:outline-none"
            >
              <option value="hour">Hourly</option>
              <option value="day">Daily</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          {/* Export CSV Section */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as ReportSectionType)}
              className="bg-transparent px-2 text-xs text-slate-800 font-medium focus:outline-none"
            >
              <option value="tokens">Export: Token Ledger</option>
              <option value="revenue">Export: Revenue Purchases</option>
              <option value="users">Export: User Accounts</option>
              <option value="ai">Export: AI Chat Usage</option>
              <option value="clicks">Export: Affiliate Clicks</option>
            </select>

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#FB7C20] text-white hover:bg-[#E86B12] px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 shadow-2xs"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Pickers (Shown only when 'custom' is active) */}
      {filters.period === "custom" && (
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Start Date:</span>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => onFilterChange({ startDate: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">End Date:</span>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => onFilterChange({ endDate: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
