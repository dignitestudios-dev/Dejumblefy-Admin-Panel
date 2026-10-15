"use client";

import { useState } from "react";
import {
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { LookupItem, LookupType } from "../types/lookups.types";
import { useUpdateLookupMutation } from "../api/lookups.mutations";

interface LookupsTableProps {
  items: LookupItem[];
  type: LookupType;
  isLoading: boolean;
  onEdit: (item: LookupItem) => void;
  onDelete: (item: LookupItem) => void;
  onAddNew: () => void;
}

export default function LookupsTable({
  items,
  type,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
}: LookupsTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const updateMutation = useUpdateLookupMutation();

  const handleToggleActive = async (item: LookupItem) => {
    try {
      setTogglingId(item._id);
      await updateMutation.mutateAsync({
        id: item._id,
        payload: { isActive: !item.isActive },
      });
    } finally {
      setTogglingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading {type} lookups...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No lookups found"
        description="There are no items configured for this lookup type matching your criteria."
        action={{
          label: `Add First ${type}`,
          onClick: onAddNew,
        }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-16 text-center">Order</th>
              <th className="py-3 px-4">Label & Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const isToggling = togglingId === item._id;

              return (
                <tr
                  key={item._id}
                  className={`group transition-colors hover:bg-slate-50/70 ${
                    !item.isActive ? "opacity-60 bg-slate-50/40" : ""
                  }`}
                >
                  {/* Order Index */}
                  <td className="py-3 px-4 text-center font-mono text-xs">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {index + 1}
                    </span>
                  </td>

                  {/* Label & Slug */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 group-hover:text-[#FB7C20] transition-colors">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4 max-w-xs">
                    {item.description ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-600 truncate" title={item.description}>
                          {item.description}
                        </span>
                        {item.type === "style" && (
                          <span className="text-[10px] text-amber-600 mt-0.5 font-medium">
                            {item.description.length}/70 chars
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs italic text-slate-400">No description provided</span>
                    )}
                  </td>

                  {/* Active Status Badge & Quick Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={isToggling}
                      title={item.isActive ? "Click to deactivate" : "Click to activate"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition-all ${
                        item.isActive
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : item.isActive ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-slate-500" />
                      )}
                      <span>{item.isActive ? "Active" : "Inactive"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(item)}
                        title="Edit Details"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 border border-transparent hover:border-amber-200 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        title="Deactivate Lookup"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
