"use client";

import {
  Coins,
  Edit2,
  Trash2,
  Loader2,
  Apple,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { TokenPackItem } from "../types/token-packs.types";
import { useSetTokenPackStatusMutation } from "../api/token-packs.mutations";

interface TokenPacksTableProps {
  packs: TokenPackItem[];
  isLoading: boolean;
  onEdit: (pack: TokenPackItem) => void;
  onDelete: (pack: TokenPackItem) => void;
}

export default function TokenPacksTable({
  packs,
  isLoading,
  onEdit,
  onDelete,
}: TokenPacksTableProps) {
  const statusMutation = useSetTokenPackStatusMutation();

  const handleToggleStatus = (pack: TokenPackItem) => {
    statusMutation.mutate({
      id: pack._id,
      isActive: !pack.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
        <p className="text-xs font-medium text-slate-500">Loading token packs...</p>
      </div>
    );
  }

  if (packs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-xs">
        <EmptyState
          title="No Token Packs Found"
          description="There are currently no token packages configured matching your filters."
          icon={<Coins className="w-6 h-6 text-slate-400" />}
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
            <tr>
              <th className="py-3 px-4">Package</th>
              <th className="py-3 px-4 text-center">Tokens</th>
              <th className="py-3 px-4 text-center">Price</th>
              <th className="py-3 px-4">Store Product IDs</th>
              <th className="py-3 px-4 text-center">Sort Order</th>
              <th className="py-3 px-4 text-center">Status</th>
              {/* <th className="py-3 px-4 text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {packs.map((pack) => (
              <tr key={pack._id} className="hover:bg-slate-50/70 transition-colors">
                {/* Name & Description */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="font-bold text-slate-900 text-xs">{pack.name}</div>
                  {pack.description && (
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {pack.description}
                    </div>
                  )}
                </td>

                {/* Tokens */}
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200 font-mono">
                    <Coins className="h-3 w-3 text-[#FB7C20]" />
                    {pack.token.toLocaleString()}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4 text-center font-semibold text-slate-800 font-mono">
                  {typeof pack.price === "number" ? `$${pack.price.toFixed(2)}` : "—"}
                </td>

                {/* Store Product IDs */}
                <td className="py-3.5 px-4">
                  <div className="space-y-1 font-mono text-[11px]">
                    {pack.storeProductIdApple ? (
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="font-semibold text-[10px] text-slate-400">iOS:</span>
                        <span className="truncate max-w-[150px]">{pack.storeProductIdApple}</span>
                      </div>
                    ) : null}
                    {pack.storeProductIdGoogle ? (
                      <div className="flex items-center gap-1 text-slate-600">
                        <span className="font-semibold text-[10px] text-slate-400">Android:</span>
                        <span className="truncate max-w-[150px]">{pack.storeProductIdGoogle}</span>
                      </div>
                    ) : null}
                    {!pack.storeProductIdApple && !pack.storeProductIdGoogle && (
                      <span className="text-slate-400">—</span>
                    )}
                  </div>
                </td>

                {/* Sort Order */}
                <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                  {pack.sortOrder ?? 0}
                </td>

                {/* Status Toggle */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(pack)}
                    disabled={statusMutation.isPending}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                      pack.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {pack.isActive ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </td>

                {/* Actions */}
                {/* <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(pack)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Edit package"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(pack)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete package"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
