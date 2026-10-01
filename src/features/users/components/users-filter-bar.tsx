"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, ArrowUpDown, Calendar, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { UsersQueryParams } from "../types/users.types";

interface UsersFilterBarProps {
  filters: UsersQueryParams;
  onFilterChange: (updated: Partial<UsersQueryParams>) => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

export default function UsersFilterBar({
  filters,
  onFilterChange,
  onRefresh,
  isFetching,
}: UsersFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed !== (filters.search || "")) {
      onFilterChange({ search: trimmed || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(filters.referred !== undefined || filters.startDate || filters.endDate)
  );

  const handleReferredChange = (val: string) => {
    if (val === "all") {
      onFilterChange({ referred: undefined, page: 1 });
    } else if (val === "referred") {
      onFilterChange({ referred: true, page: 1 });
    } else if (val === "direct") {
      onFilterChange({ referred: false, page: 1 });
    }
  };

  const currentReferredVal =
    filters.referred === true ? "referred" : filters.referred === false ? "direct" : "all";

  const clearDateFilters = () => {
    onFilterChange({ startDate: undefined, endDate: undefined, page: 1 });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      {/* Primary Row: Search and main controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            maxLength={100}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email address..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onFilterChange({ search: undefined, page: 1 });
              }}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["all", "active", "suspended"] as const).map((status) => (
              <button
                key={status}
                onClick={() =>
                  onFilterChange({
                    status: status,
                    page: 1,
                  })
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                  (filters.status || "all") === status
                    ? "bg-[#000072] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Referral Channel Filter */}
          <select
            value={currentReferredVal}
            onChange={(e) => handleReferredChange(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="referred">Referred Signups</option>
            <option value="direct">Direct Signups</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={filters.sortBy || "createdAt"}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as "createdAt" | "tokenBalance" | "name",
                page: 1,
              })
            }
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="createdAt">Sort: Joined Date</option>
            <option value="tokenBalance">Sort: Token Balance</option>
            <option value="name">Sort: Name</option>
          </select>

          {/* Sort Order Button */}
          <button
            onClick={() =>
              onFilterChange({
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                page: 1,
              })
            }
            title="Toggle sort direction"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <span className="uppercase">{filters.sortOrder || "desc"}</span>
          </button>

          {/* Advanced Filter Toggle (Dates) */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Toggle Date Filters"
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors ${
              showAdvanced || filters.startDate || filters.endDate
                ? "border-[#FB7C20]/40 bg-[#FB7C20]/10 text-[#FB7C20]"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dates</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isFetching}
            title="Refresh List"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filter Row (Date Range) */}
      {showAdvanced && (
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-600 font-medium flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#000072]" /> Registration Date Range:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-500">From:</label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => onFilterChange({ startDate: e.target.value || undefined, page: 1 })}
              className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-500">To:</label>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => onFilterChange({ endDate: e.target.value || undefined, page: 1 })}
              className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>
          {(filters.startDate || filters.endDate) && (
            <button
              onClick={clearDateFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 ml-auto"
            >
              <X className="h-3 w-3" /> Clear Dates
            </button>
          )}
        </div>
      )}
    </div>
  );
}
