"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { LookupItem } from "../types/lookups.types";
import { useDeleteLookupMutation } from "../api/lookups.mutations";

interface DeleteLookupModalProps {
  item: LookupItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteLookupModal({ item, isOpen, onClose }: DeleteLookupModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const deleteMutation = useDeleteLookupMutation();

  if (!isOpen || !item) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    try {
      await deleteMutation.mutateAsync(item._id);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "Failed to deactivate lookup item."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Deactivate Lookup</h3>
              <p className="text-xs text-slate-500">Soft delete item from customer visibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-sm text-slate-700">
            Are you sure you want to deactivate{" "}
            <span className="font-semibold text-slate-900">"{item.label}"</span>?
          </p>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
            <p className="font-semibold text-amber-900">Safety Notice:</p>
            <p>
              This is a safe soft-delete. It hides the option from mobile app category/style pickers
              while preserving historical design project references that use this slug.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deactivating...</span>
                </>
              ) : (
                <span>Deactivate Lookup</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
