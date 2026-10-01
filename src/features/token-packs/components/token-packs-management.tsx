"use client";

import { useState, useMemo } from "react";
import { Plus, RefreshCw, Search, Coins, Sparkles, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { TokenPackItem } from "../types/token-packs.types";
import { useTokenPacksQuery } from "../api/token-packs.queries";
import TokenPacksTable from "./token-packs-table";
import CreateTokenPackModal from "./create-token-pack-modal";
import EditTokenPackModal from "./edit-token-pack-modal";
import DeleteTokenPackModal from "./delete-token-pack-modal";

export default function TokenPacksManagement() {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<TokenPackItem | null>(null);
  const [deletingPack, setDeletingPack] = useState<TokenPackItem | null>(null);

  const queryParams = useMemo(() => {
    if (statusFilter === "active") return { isActive: true };
    if (statusFilter === "inactive") return { isActive: false };
    return undefined;
  }, [statusFilter]);

  const { data: packs = [], isLoading, refetch, isFetching } = useTokenPacksQuery(queryParams);

  const filteredPacks = useMemo(() => {
    const trimmed = debouncedSearch.trim();
    if (!trimmed) return packs;
    const q = trimmed.toLowerCase();
    return packs.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchApple = p.storeProductIdApple?.toLowerCase().includes(q);
      const matchGoogle = p.storeProductIdGoogle?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchName || matchApple || matchGoogle || matchDesc;
    });
  }, [packs, debouncedSearch]);

  const totalTokensOffered = useMemo(() => {
    return packs.reduce((acc, p) => acc + (p.token || 0), 0);
  }, [packs]);

  const activeCount = useMemo(() => {
    return packs.filter((p) => p.isActive).length;
  }, [packs]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Coins className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">In-App Token Packs</h1>
          </div>
          <p className="text-xs text-slate-500">
            Configure token bundles for iOS In-App Purchases and Google Play Billing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh packages"
            aria-label="Refresh packages"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Token Pack</span>
          </button> */}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Packages</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-[#FB7C20]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{packs.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">Configured in catalog</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active in Stores</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{activeCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Live for user purchase</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cumulative Pool</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#000072]">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-[#000072]">
            {totalTokensOffered.toLocaleString()} <span className="text-xs text-slate-500 font-normal">tokens</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Across all packages</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages by name, store ID, or description..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear package search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === "inactive"
                  ? "bg-rose-50 text-rose-700 border border-rose-200 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <TokenPacksTable
        packs={filteredPacks}
        isLoading={isLoading}
        onEdit={(pack: TokenPackItem) => setEditingPack(pack)}
        onDelete={(pack: TokenPackItem) => setDeletingPack(pack)}
      />

      {/* Modals */}
      <CreateTokenPackModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditTokenPackModal
        pack={editingPack}
        isOpen={!!editingPack}
        onClose={() => setEditingPack(null)}
      />

      <DeleteTokenPackModal
        pack={deletingPack}
        isOpen={!!deletingPack}
        onClose={() => setDeletingPack(null)}
      />
    </div>
  );
}
