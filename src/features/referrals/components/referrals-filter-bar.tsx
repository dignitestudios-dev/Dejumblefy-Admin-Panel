import { useState, useEffect } from "react";
import { Search, RotateCcw, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { ReferralsQueryParams, ReferralRewardStatus } from "../types/referrals.types";

interface ReferralsFilterBarProps {
  filters: ReferralsQueryParams;
  onFilterChange: (updated: Partial<ReferralsQueryParams>) => void;
  onReset: () => void;
}

export default function ReferralsFilterBar({
  filters,
  onFilterChange,
  onReset,
}: ReferralsFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed !== (filters.search || "")) {
      onFilterChange({ search: trimmed || undefined, page: 1 });
    }
  }, [debouncedSearch]);

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.status && filters.status !== "all") ||
      filters.startDate ||
      filters.endDate
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search referrer or referee..."
            value={searchTerm}
            maxLength={100}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onFilterChange({ search: undefined, page: 1 });
              }}
              aria-label="Clear referrals search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status || "all"}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as ReferralRewardStatus | "all",
                page: 1,
              })
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="all">All Reward Statuses</option>
            <option value="earned">Earned & Credited</option>
            <option value="pending">Pending Validation</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-semibold uppercase">
            From:
          </span>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFilterChange({ startDate: e.target.value || undefined, page: 1 })}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-14 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#FB7C20] focus:outline-none"
          />
        </div>

        {/* End Date & Reset */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-semibold uppercase">
              To:
            </span>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => onFilterChange({ endDate: e.target.value || undefined, page: 1 })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-[#FB7C20] focus:outline-none"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              title="Reset Filters"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
