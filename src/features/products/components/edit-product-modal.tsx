"use client";

import { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Sparkles,
  AlertCircle,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { ProductItem } from "../types/products.types";
import { useUpdateProductMutation, useAISuggestTagsMutation } from "../api/products.mutations";
import { useLookupsQuery } from "@/features/lookups/api/lookups.queries";

interface EditProductModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({ product, isOpen, onClose }: EditProductModalProps) {
  const [amazonUrl, setAmazonUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [dimensions, setDimensions] = useState({ length: "", width: "", height: "" });
  const [priority, setPriority] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Queries & Mutations
  const { data: categories = [] } = useLookupsQuery({ type: "category", isActive: true });
  const { data: styles = [] } = useLookupsQuery({ type: "style", isActive: true });
  const { data: materials = [] } = useLookupsQuery({ type: "material", isActive: true });

  const updateMutation = useUpdateProductMutation();
  const aiSuggestMutation = useAISuggestTagsMutation();

  useEffect(() => {
    if (product) {
      setAmazonUrl(product.defaultLink || "");
      setTitle(product.title || "");
      setImageUrl(product.imageUrl || "");
      setAiDescription(product.aiDescription || "");
      setSelectedCategories(product.categories || []);
      setSelectedStyles(product.styles || []);
      setSelectedMaterials(product.materials || []);
      setTags(product.tags || []);
      setDimensions({
        length: product.dimensions?.length?.toString() || "",
        width: product.dimensions?.width?.toString() || "",
        height: product.dimensions?.height?.toString() || "",
      });
      setPriority(product.priority ?? 0);
      setIsActive(product.isActive ?? true);
      setErrorMsg(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAISuggest = async () => {
    if (!title.trim()) {
      setErrorMsg("Please enter a product title before requesting AI suggestions.");
      return;
    }
    setErrorMsg(null);
    try {
      const suggestions = await aiSuggestMutation.mutateAsync({
        title: title.trim(),
        description: aiDescription.trim() || null,
        imageUrl: imageUrl.trim() || null,
      });

      if (suggestions.categories?.length) {
        setSelectedCategories((prev) => Array.from(new Set([...prev, ...suggestions.categories])));
      }
      if (suggestions.styles?.length) {
        setSelectedStyles((prev) => Array.from(new Set([...prev, ...suggestions.styles])));
      }
      if (suggestions.materials?.length) {
        setSelectedMaterials((prev) => Array.from(new Set([...prev, ...suggestions.materials])));
      }
      if (suggestions.tags?.length) {
        setTags((prev) => Array.from(new Set([...prev, ...suggestions.tags])));
      }
      if (suggestions.aiDescription && !aiDescription.trim()) {
        setAiDescription(suggestions.aiDescription);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "AI suggestions generation failed."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg("Product title is required.");
      return;
    }
    if (selectedCategories.length === 0) {
      setErrorMsg("At least one room category must be selected.");
      return;
    }

    try {
      const payloadDims =
        dimensions.length || dimensions.width || dimensions.height
          ? {
              length: dimensions.length ? Number(dimensions.length) : null,
              width: dimensions.width ? Number(dimensions.width) : null,
              height: dimensions.height ? Number(dimensions.height) : null,
            }
          : null;

      await updateMutation.mutateAsync({
        id: product._id,
        payload: {
          amazonUrl: amazonUrl.trim() || undefined,
          title: title.trim(),
          categories: selectedCategories,
          styles: selectedStyles,
          materials: selectedMaterials,
          tags,
          imageUrl: imageUrl.trim() || null,
          aiDescription: aiDescription.trim() || null,
          dimensions: payloadDims,
          priority,
          isActive,
        },
      });

      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "Failed to update product."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000072]/10 text-[#000072]">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
              <p className="text-xs text-slate-500">
                ASIN: <span className="font-mono text-slate-700 font-semibold">{product.asin}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Title & AI Suggest */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiSuggestMutation.isPending || !title.trim()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FB7C20] hover:text-[#E86B12] disabled:opacity-40 transition-colors"
              >
                {aiSuggestMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                <span>AI Auto-Suggest Tags</span>
              </button>
            </div>
            <input
              type="text"
              required
              maxLength={200}
              placeholder="e.g. 6-Piece Clear Plastic Drawer Organizer Bins"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors"
            />
          </div>

          {/* Amazon URL (Optional change) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Amazon Product URL <span className="text-slate-400 text-[11px] font-normal">(Leave blank if unchanged)</span>
            </label>
            <input
              type="url"
              placeholder={product.defaultLink}
              value={amazonUrl}
              onChange={(e) => setAmazonUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors font-mono"
            />
          </div>

          {/* Image URL & Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                placeholder="https://m.media-amazon.com/images/I/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors font-mono"
              />
            </div>
            <div className="flex items-center justify-center">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Product preview"
                  className="h-16 w-16 rounded-xl object-contain border border-slate-200 bg-white p-1 shadow-xs"
                  onError={() => setImageUrl("")}
                />
              ) : (
                <div className="h-16 w-16 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 text-center p-1">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Room Categories */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Room Categories <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
              {categories.map((c) => {
                const isSelected = selectedCategories.includes(c.slug);
                return (
                  <button
                    type="button"
                    key={c._id}
                    onClick={() => toggleItem(selectedCategories, setSelectedCategories, c.slug)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#000072] text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Styles */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Design Styles
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
              {styles.map((s) => {
                const isSelected = selectedStyles.includes(s.slug);
                return (
                  <button
                    type="button"
                    key={s._id}
                    onClick={() => toggleItem(selectedStyles, setSelectedStyles, s.slug)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#000072] text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Materials
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-2 rounded-xl border border-slate-200 bg-slate-50">
              {materials.map((m) => {
                const isSelected = selectedMaterials.includes(m.slug);
                return (
                  <button
                    type="button"
                    key={m._id}
                    onClick={() => toggleItem(selectedMaterials, setSelectedMaterials, m.slug)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#FB7C20] text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keywords & Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag and press Enter"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* AI Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                AI Description (Recommendation Pitch)
              </label>
              <span className="text-[11px] text-slate-400">{aiDescription.length}/1000</span>
            </div>
            <textarea
              rows={3}
              maxLength={1000}
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20] transition-colors resize-none"
            />
          </div>

          {/* Dimensions & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Length (in)</label>
              <input
                type="number"
                step="0.1"
                placeholder="12.5"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Width (in)</label>
              <input
                type="number"
                step="0.1"
                placeholder="6.0"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Height (in)</label>
              <input
                type="number"
                step="0.1"
                placeholder="4.0"
                value={dimensions.height}
                onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Priority (-1k to 1k)</label>
              <input
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
          </div>

          {/* Catalog Active Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <span className="text-xs font-semibold text-slate-900">Active in Recommendation Deck</span>
              <p className="text-[11px] text-slate-500">
                Immediately enable this product for the conversational organizing shortlisting AI
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-[#FB7C20]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
              disabled={updateMutation.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#FB7C20] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-all disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Update Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
