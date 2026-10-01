"use client";

import { useState } from "react";
import { X, Sparkles, AlertCircle, Loader2, Info } from "lucide-react";
import { LookupType } from "../types/lookups.types";
import { useCreateLookupMutation } from "../api/lookups.mutations";

interface CreateLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: LookupType;
}

export default function CreateLookupModal({
  isOpen,
  onClose,
  defaultType = "category",
}: CreateLookupModalProps) {
  const [type, setType] = useState<LookupType>(defaultType);
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createMutation = useCreateLookupMutation();

  if (!isOpen) return null;

  const maxDescLength = type === "style" ? 70 : 500;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLabel(val);
    if (!isSlugManuallyEdited) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-"));
  };

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

    if (type === "style" && description.length > 70) {
      setErrorMsg("Style descriptions must be 70 characters or fewer.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        type,
        label: trimmedLabel,
        ...(slug.trim() ? { slug: slug.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(typeof sortOrder === "number" ? { sortOrder } : {}),
      });

      // Reset & close
      setLabel("");
      setSlug("");
      setIsSlugManuallyEdited(false);
      setDescription("");
      setSortOrder("");
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "Failed to create lookup item."
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
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Create New Lookup</h3>
              <p className="text-xs text-slate-500">Add options for categories, styles, or materials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (label.trim() || slug.trim() || description.trim()) {
                if (!window.confirm("You have unsaved changes. Discard them?")) return;
              }
              onClose();
            }}
            aria-label="Close create lookup dialog"
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

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lookup Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "category" as LookupType, label: "Room Category" },
                { id: "style" as LookupType, label: "Design Style" },
                { id: "material" as LookupType, label: "Material" },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  disabled={createMutation.isPending}
                  onClick={() => {
                    setType(opt.id);
                    if (opt.id === "style" && description.length > 70) {
                      setDescription(description.slice(0, 70));
                    }
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-center disabled:opacity-50 ${
                    type === opt.id
                      ? "border-[#000072] bg-[#000072] text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
              maxLength={60}
              disabled={createMutation.isPending}
              placeholder="e.g. Living Room, Japandi, Walnut Wood"
              value={label}
              onChange={handleLabelChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Slug Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Slug Identifier <span className="text-slate-400 text-[11px] font-normal">(Auto-generated or custom)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. living-room"
              value={slug}
              onChange={handleSlugChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
            />
          </div>

          {/* Description Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Description {type === "style" && <span className="text-amber-600 font-normal">(Max 70 chars)</span>}
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
              placeholder={
                type === "style"
                  ? "Crisp, concise aesthetic guide (max 70 chars for AI engine prompt)..."
                  : "Detailed description of this category or material..."
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors resize-none"
            />
            {type === "style" && (
              <div className="mt-1 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>Backend requirement: Style descriptions are injected into AI image generation prompts and cannot exceed 70 characters.</span>
              </div>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Sort Order <span className="text-slate-400 text-[11px] font-normal">(Optional, defaults to end)</span>
            </label>
            <input
              type="number"
              min={0}
              placeholder="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-[#FB7C20] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Save Lookup Item</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
