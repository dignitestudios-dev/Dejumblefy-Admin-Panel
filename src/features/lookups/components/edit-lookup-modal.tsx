"use client";

import { useState, useEffect } from "react";
import { X, Edit3, AlertCircle, Loader2, Info } from "lucide-react";
import { LookupItem, LOOKUP_TYPE_LABELS } from "../types/lookups.types";
import { useUpdateLookupMutation } from "../api/lookups.mutations";

interface EditLookupModalProps {
  item: LookupItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditLookupModal({ item, isOpen, onClose }: EditLookupModalProps) {
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateMutation = useUpdateLookupMutation();

  useEffect(() => {
    if (item) {
      setLabel(item.label || "");
      setDescription(item.description || "");
      setSortOrder(item.sortOrder ?? 0);
      setIsActive(item.isActive ?? true);
      setErrorMsg(null);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const maxDescLength = item.type === "style" ? 70 : 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      setErrorMsg("Label is required.");
      return;
    }

    if (trimmedLabel.length > 60) {
      setErrorMsg("Label cannot exceed 60 characters.");
      return;
    }

    if (item.type === "style" && description.length > 70) {
      setErrorMsg("Style descriptions must be 70 characters or fewer.");
      return;
    }

    if (typeof sortOrder === "number" && (sortOrder < 0 || sortOrder > 9999)) {
      setErrorMsg("Sort order must be between 0 and 9999 (maximum 4 digits).");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: item._id,
        payload: {
          label: trimmedLabel,
          description: description.trim(),
          sortOrder,
          isActive,
        },
      });

      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || `Failed to update ${LOOKUP_TYPE_LABELS[item.type].toLowerCase()}.`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Edit {LOOKUP_TYPE_LABELS[item.type]}</h3>
              <p className="text-xs text-slate-500 truncate max-w-[340px]">
                Updating <span className="text-slate-800 font-mono font-medium truncate">/{item.slug}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Immutable Slug Note */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between gap-3 overflow-hidden">
            <span className="text-xs text-slate-600 font-medium shrink-0">Slug Identifier:</span>
            <span
              title={item.slug}
              className="font-mono text-xs text-[#000072] bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-semibold truncate max-w-[300px] text-right"
            >
              {item.slug}
            </span>
          </div>

          {/* Label Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Display Label <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{label.length}/60</span>
            </div>
            <input
              type="text"
              required
              maxLength={60}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
            />
          </div>

          {/* Description Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Description {item.type === "style" && <span className="text-amber-600 font-normal">(Max 70 chars)</span>}
              </label>
              <span
                className={`text-[11px] ${
                  description.length >= maxDescLength ? "text-rose-500 font-bold" : "text-slate-400"
                }`}
              >
                {description.length}/{maxDescLength}
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={maxDescLength}
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors resize-none"
            />
            {item.type === "style" && (
              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>Backend requirement: Style descriptions are injected into AI image generation prompts and cannot exceed 70 characters.</span>
              </div>
            )}
          </div>

          {/* Sort Order & Active Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Sort Order
                </label>
                <span className="text-[11px] text-slate-400">Max 9999</span>
              </div>
              <input
                type="number"
                min={0}
                max={9999}
                value={sortOrder}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 4) {
                    setSortOrder(val === "" ? 0 : Math.min(Number(val), 9999));
                  }
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full py-2 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                />
                <span>{isActive ? "Active in Apps" : "Inactive / Hidden"}</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || (item.type === "style" && description.length > 70)}
              className="flex items-center gap-2 rounded-xl bg-[#FB7C20] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
