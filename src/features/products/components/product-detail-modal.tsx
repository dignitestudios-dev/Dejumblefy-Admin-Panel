"use client";

import { useState, useEffect } from "react";
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
  AlertCircle,
} from "lucide-react";
import { ProductItem } from "../types/products.types";
import { useCheckProductLinkMutation } from "../api/products.mutations";

import { useLookupsQuery } from "@/features/lookups/api/lookups.queries";

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
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(product);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  const checkLinkMutation = useCheckProductLinkMutation();
  const { data: retailers = [] } = useLookupsQuery({ type: "retailer" });

  useEffect(() => {
    setCurrentProduct(product);
    setCheckResult(null);
    setCheckError(null);
  }, [product]);

  if (!isOpen || !product) return null;

  const activeProduct = currentProduct || product;

  const retailerSlug = activeProduct.retailer || "amazon";
  const matchedRetailer = retailers.find((r) => r.slug === retailerSlug);
  const retailerName =
    matchedRetailer?.label ||
    (retailerSlug === "amazon"
      ? "Amazon"
      : retailerSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));

  const handleCopy = () => {
    if (activeProduct.defaultLink) {
      navigator.clipboard.writeText(activeProduct.defaultLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCheckLink = async () => {
    setCheckResult(null);
    setCheckError(null);
    try {
      const updated = await checkLinkMutation.mutateAsync(activeProduct._id);
      if (updated) {
        setCurrentProduct((prev) => ({
          ...prev!,
          linkStatus: updated.linkStatus ?? prev!.linkStatus,
          linkCheckedAt: updated.linkCheckedAt ?? prev!.linkCheckedAt,
        }));
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setCheckError(
        error?.response?.data?.message || error?.message || "Failed to verify product link."
      );
    }
  };

  const getLinkStatusBadge = () => {
    switch (activeProduct.linkStatus) {
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
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 shadow-xs flex items-center gap-2">
              <span className="font-semibold text-xs text-[#000072]">
                {retailerName}
              </span>
              {activeProduct.asin && (
                <span className="font-mono text-xs font-bold text-slate-600 border-l border-slate-200 pl-2">
                  ASIN: {activeProduct.asin}
                </span>
              )}
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
              {activeProduct.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.title}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400">No Image</span>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 leading-snug">{activeProduct.title}</h3>

              {/* Status and Analytics strip */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${activeProduct.isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                >
                  {activeProduct.isActive ? "Active in AI Catalog" : "Inactive / Draft"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-600 border border-slate-200">
                  <MousePointerClick className="h-3 w-3 text-[#000072]" />
                  <span>{activeProduct.clickCount ?? 0} clicks</span>
                </span>
              </div>
            </div>
          </div>

          {/* Affiliate URL Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Clean Affiliate Link</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCheckLink}
                  disabled={checkLinkMutation.isPending}
                  title="Initiate Link Auto-Check"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${checkLinkMutation.isPending ? "animate-spin text-[#FB7C20]" : ""}`}
                  />
                  <span>{checkLinkMutation.isPending ? "Checking..." : "Link Auto-Check"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
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
                  href={activeProduct.defaultLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#000072]/10 text-[#000072] border border-[#000072]/20 px-2.5 py-1 text-[11px] font-semibold hover:bg-[#000072]/20 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Open on {retailerName}</span>
                </a>
              </div>
            </div>
            <p className="font-mono text-xs text-slate-700 break-all bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
              {activeProduct.defaultLink}
            </p>
            {activeProduct.linkCheckedAt && (
              <p className="text-[10px] text-slate-400">
                Last checked: {new Date(activeProduct.linkCheckedAt).toLocaleString()}
              </p>
            )}

            {/* Verification Result Feedback */}
            {checkResult && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{checkResult}</span>
              </div>
            )}
            {checkError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{checkError}</span>
              </div>
            )}
          </div>

          {/* AI Description */}
          {activeProduct.aiDescription && (
            <div className="rounded-2xl border border-[#FB7C20]/20 bg-[#FB7C20]/5 p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FB7C20]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Recommendation Pitch</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{activeProduct.aiDescription}</p>
            </div>
          )}

          {/* Taxonomy Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Categories */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-500">
                Categories ({activeProduct.categories?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {activeProduct.categories?.length ? (
                  activeProduct.categories.map((c) => (
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
                Styles ({activeProduct.styles?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {activeProduct.styles?.length ? (
                  activeProduct.styles.map((s) => (
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
                Materials ({activeProduct.materials?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1">
                {activeProduct.materials?.length ? (
                  activeProduct.materials.map((m) => (
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
          {activeProduct.tags && activeProduct.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500">Keywords & Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {activeProduct.tags.map((tag) => (
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
                {activeProduct.dimensions?.length || activeProduct.dimensions?.width || activeProduct.dimensions?.height
                  ? `${activeProduct.dimensions.length ?? "-"}″ × ${activeProduct.dimensions.width ?? "-"}″ × ${activeProduct.dimensions.height ?? "-"}″`
                  : "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Added: {new Date(activeProduct.createdAt).toLocaleDateString()}</span>
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
              onEdit(activeProduct);
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
