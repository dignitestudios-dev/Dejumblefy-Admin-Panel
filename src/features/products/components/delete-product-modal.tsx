"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { ProductItem } from "../types/products.types";
import { useDeleteProductMutation } from "../api/products.mutations";

interface DeleteProductModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProductModal({
  product,
  isOpen,
  onClose,
}: DeleteProductModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const deleteMutation = useDeleteProductMutation();
  const [deactivatedNotice, setDeactivatedNotice] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleConfirm = async () => {
    setErrorMsg(null);
    setDeactivatedNotice(null);
    try {
      const res = await deleteMutation.mutateAsync(product._id);
      if (res.deleted === false) {
        setDeactivatedNotice(
          "This product is referenced by existing customer chats, so it was safely deactivated rather than deleted."
        );
        setTimeout(() => {
          onClose();
          setDeactivatedNotice(null);
        }, 2500);
      } else {
        onClose();
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "Failed to remove product from catalog."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Affiliate Product</h3>
              <p className="text-xs text-slate-500">Remove product from recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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

          {deactivatedNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <span>{deactivatedNotice}</span>
            </div>
          )}

          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">"{product.title}"</span>?
          </p>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 font-mono">
            ASIN: <span className="font-semibold text-[#000072]">{product.asin}</span>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            <span className="font-bold">Recommendation Impact:</span> This
            will remove this product from the AI shortlisting algorithm and user recommendation decks.
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-all disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Product</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
