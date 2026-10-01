"use client";

import { useState } from "react";
import {
  X,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  MousePointerClick,
  Ruler,
  Calendar,
  Sparkles,
} from "lucide-react";
import { ProductItem } from "../types/products.types";
import { useCheckProductLinkMutation } from "../api/products.mutations";

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (product: ProductItem) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onEdit,
}: ProductDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const checkLinkMutation = useCheckProductLinkMutation();

  if (!isOpen || !product) return null;

  const handleCopy = () => {
    if (product.defaultLink) {
      navigator.clipboard.writeText(product.defaultLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCheckLink = async () => {
    try {
      await checkLinkMutation.mutateAsync(product._id);
    } catch {
      // Handled by react query
    }
  };

  const getLinkStatusBadge = () => {
    switch (product.linkStatus) {
      case "ok":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Link Healthy (200 OK)</span>
          </span>
        );
      case "broken":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Broken Link (404/410)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Unchecked</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
              <span className="font-mono text-xs font-bold text-[#000072]">
                ASIN: {product.asin}
              </span>
            </div>
            {getLinkStatusBadge()}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Main Visual & Info */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="h-32 w-32 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 overflow-hidden shadow-xs">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{product.title}</h3>

              {/* Status and Analytics strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    product.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {product.isActive ? "Active in AI Catalog" : "Inactive / Draft"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600 border border-slate-200">
                  <MousePointerClick className="h-3 w-3 text-[#000072]" />
                  <span>{product.clickCount ?? 0} clicks</span>
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600 border border-slate-200 font-mono">
                  Priority: {product.priority ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Affiliate URL Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Clean Affiliate Link</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCheckLink}
                  disabled={checkLinkMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-xs"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${checkLinkMutation.isPending ? "animate-spin text-[#FB7C20]" : ""}`}
                  />
                  <span>Re-check Link</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href={product.defaultLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#000072]/10 text-[#000072] border border-[#000072]/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-[#000072]/20 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open Amazon</span>
                </a>
              </div>
            </div>
            <p className="font-mono text-xs text-slate-700 break-all bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
              {product.defaultLink}
            </p>
            {product.linkCheckedAt && (
              <p className="text-[10px] text-slate-400">
                Last checked: {new Date(product.linkCheckedAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* AI Description */}
          {product.aiDescription && (
            <div className="rounded-2xl border border-[#FB7C20]/20 bg-[#FB7C20]/5 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FB7C20]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Recommendation Pitch</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{product.aiDescription}</p>
            </div>
          )}

          {/* Taxonomy Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Categories */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Categories ({product.categories?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {product.categories?.length ? (
                  product.categories.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-800 border border-slate-200 shadow-xs"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">None</span>
                )}
              </div>
            </div>

            {/* Styles */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Styles ({product.styles?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {product.styles?.length ? (
                  product.styles.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-[#000072]/10 px-2 py-0.5 text-[11px] font-medium text-[#000072] border border-[#000072]/20"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">None</span>
                )}
              </div>
            </div>

            {/* Materials */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Materials ({product.materials?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {product.materials?.length ? (
                  product.materials.map((m) => (
                    <span
                      key={m}
                      className="rounded-md bg-[#FB7C20]/10 px-2 py-0.5 text-[11px] font-medium text-[#FB7C20] border border-[#FB7C20]/20"
                    >
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-xs italic text-slate-400">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500">Keywords & Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs text-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dimensions & Dates footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Ruler className="h-3.5 w-3.5 text-slate-400" />
              <span>
                Dimensions:{" "}
                {product.dimensions?.length || product.dimensions?.width || product.dimensions?.height
                  ? `${product.dimensions.length ?? "-"}″ × ${product.dimensions.width ?? "-"}″ × ${product.dimensions.height ?? "-"}″`
                  : "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
            className="rounded-xl bg-[#FB7C20] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-all"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}
