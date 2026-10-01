"use client";

import { useState, useMemo, Suspense } from "react";
import {
  Layers,
  Palette,
  Home,
  Plus,
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useUrlState } from "@/hooks/use-url-state";
import { useDebounce } from "@/hooks/use-debounce";
import { LookupType, LookupItem, LookupTabConfig } from "../types/lookups.types";
import { useLookupsQuery } from "../api/lookups.queries";
import LookupsTable from "./lookups-table";
import CreateLookupModal from "./create-lookup-modal";
import EditLookupModal from "./edit-lookup-modal";
import DeleteLookupModal from "./delete-lookup-modal";

const TABS: LookupTabConfig[] = [
  {
    type: "category",
    label: "Room Categories",
    pluralLabel: "Categories",
    description: "Types of interior rooms (e.g. Living Room, Kitchen, Master Bedroom)",
    badgeColor: "blue",
  },
  {
    type: "style",
    label: "Design Styles",
    pluralLabel: "Styles",
    description: "Aesthetic directions for AI generation (e.g. Minimalist, Japandi, Industrial)",
    badgeColor: "purple",
  },
  {
    type: "material",
    label: "Materials",
    pluralLabel: "Materials",
    description: "Surfaces and structural materials (e.g. Oak Wood, Polished Concrete, Brass)",
    badgeColor: "amber",
  },
];

function LookupsManagementInner() {
  const [tabParam, setTabParam] = useUrlState("type", "category");
  const activeTab: LookupType =
    tabParam === "style" || tabParam === "material" ? tabParam : "category";

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LookupItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<LookupItem | null>(null);

  const { data: items = [], isLoading, isError, error, refetch, isFetching } = useLookupsQuery({
    type: activeTab,
  });

  const totalCount = items.length;
  const activeCount = useMemo(() => items.filter((i) => i.isActive).length, [items]);
  const inactiveCount = totalCount - activeCount;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter === "active" && !item.isActive) return false;
      if (statusFilter === "inactive" && item.isActive) return false;

      const trimmed = debouncedSearch.trim();
      if (trimmed) {
        const q = trimmed.toLowerCase();
        const matchesLabel = item.label?.toLowerCase().includes(q);
        const matchesSlug = item.slug?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        if (!matchesLabel && !matchesSlug && !matchesDesc) return false;
      }

      return true;
    });
  }, [items, statusFilter, debouncedSearch]);

  const currentTabConfig = TABS.find((t) => t.type === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Lookup Management</span>
            <span className="rounded-lg bg-[#000072]/10 px-2.5 py-0.5 text-xs font-semibold text-[#000072]">
              Taxonomy & Enums
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure room types, design themes, and finishes powering the AI engine and mobile pickers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh lookup list"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add {currentTabConfig.label.slice(0, -1)}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.type;
          const Icon = tab.type === "category" ? Home : tab.type === "style" ? Palette : Layers;

          return (
            <button
              type="button"
              key={tab.type}
              onClick={() => {
                setTabParam(tab.type);
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`flex flex-1 items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#000072] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Counter chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total {currentTabConfig.pluralLabel}</div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Configured in taxonomy</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Active (Visible in App)</div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{activeCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Shown to mobile users</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Draft / Inactive</div>
          <div className="mt-2 text-2xl font-bold text-slate-400">{inactiveCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Hidden from pickers</div>
        </div>
      </div>

      {/* Error alert */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <span>{error instanceof Error ? error.message : "Failed to load lookup items."}</span>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            maxLength={100}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${currentTabConfig.pluralLabel.toLowerCase()} by name, slug or description...`}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-[#000072] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "inactive"
                  ? "bg-slate-200 text-slate-800 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <LookupsTable
        type={activeTab}
        items={filteredItems}
        isLoading={isLoading}
        onAddNew={() => setIsCreateOpen(true)}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => setDeletingItem(item)}
      />

      {/* Modals */}
      <CreateLookupModal
        defaultType={activeTab}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditLookupModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
      />

      <DeleteLookupModal
        item={deletingItem}
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  );
}

export default function LookupsManagement() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading lookups...</div>}>
      <LookupsManagementInner />
    </Suspense>
  );
}
