"use client";

import { useState } from "react";
import {
  ExternalLink,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  ShoppingBag,
  Plus,
  Loader2,
} from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { ProductItem } from "../types/products.types";
import {
  useSetProductStatusMutation,
  useCheckProductLinkMutation,
} from "../api/products.mutations";

import { LookupItem } from "@/features/lookups/types/lookups.types";

interface ProductsTableProps {
  products: ProductItem[];
  retailers?: LookupItem[];
  isLoading: boolean;
  onInspect: (product: ProductItem) => void;
  onEdit: (product: ProductItem) => void;
  onDelete: (product: ProductItem) => void;
  onAddNew: () => void;
}

export default function ProductsTable({
  products,
  retailers,
  isLoading,
  onInspect,
  onEdit,
  onDelete,
  onAddNew,
}: ProductsTableProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [checkingLinkId, setCheckingLinkId] = useState<string | null>(null);

  const setStatusMutation = useSetProductStatusMutation();
  const checkLinkMutation = useCheckProductLinkMutation();

  const getRetailerLabel = (slug?: string) => {
    if (!slug || slug === "amazon") return "Amazon";
    const found = retailers?.find((r) => r.slug === slug);
    if (found) return found.label;
    return slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleToggleStatus = async (product: ProductItem) => {
    try {
      setTogglingId(product._id);
      await setStatusMutation.mutateAsync({
        id: product._id,
        isActive: !product.isActive,
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleCheckLink = async (productId: string) => {
    try {
      setCheckingLinkId(productId);
      await checkLinkMutation.mutateAsync(productId);
    } finally {
      setCheckingLinkId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
        <p className="text-xs text-slate-500">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="No affiliate products matched your active filters or search query."
        action={{
          label: "Add New Product",
          onClick: onAddNew,
        }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Product & Retailer</th>
              <th className="py-3.5 px-4">Categories / Styles</th>
              <th className="py-3.5 px-4 text-center">Link Health</th>
              <th className="py-3.5 px-4 text-center">Catalog Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const isToggling = togglingId === product._id;
              const isCheckingLink = checkingLinkId === product._id;
              const retailerSlug = product.retailer || "amazon";
              const retailerLabel = getRetailerLabel(retailerSlug);
              const isAmazon = retailerSlug === "amazon";

              return (
                <tr
                  key={product._id}
                  className={`group transition-colors hover:bg-slate-50/80 ${
                    !product.isActive ? "opacity-60 bg-slate-50/30" : ""
                  }`}
                >
                  {/* Thumbnail, Title & Retailer info */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden p-1 shadow-xs">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = "none";
                            }}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <button
                          onClick={() => onInspect(product)}
                          className="font-bold text-slate-900 group-hover:text-[#000072] transition-colors truncate text-left text-xs"
                          title={product.title}
                        >
                          {product.title}
                        </button>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span
                            className={`font-semibold text-[10px] px-1.5 py-0.5 rounded border ${
                              isAmazon
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-teal-50 text-teal-800 border-teal-200"
                            }`}
                          >
                            {retailerLabel}
                          </span>
                          {product.asin && (
                            <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-semibold border border-slate-200">
                              {product.asin}
                            </span>
                          )}
                          <a
                            href={product.defaultLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 hover:text-slate-800 transition-colors"
                            title={`View on ${retailerLabel}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Link</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Categories & Styles */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-1">
                        {product.categories?.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700"
                          >
                            {c}
                          </span>
                        ))}
                        {(product.categories?.length || 0) > 2 && (
                          <span className="text-[10px] text-slate-400">
                            +{product.categories.length - 2} more
                          </span>
                        )}
                      </div>

                      {product.styles && product.styles.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.styles.slice(0, 1).map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-[#000072]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#000072]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Link Health */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      {product.linkStatus === "ok" && (
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Healthy</span>
                        </span>
                      )}
                      {product.linkStatus === "broken" && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Broken</span>
                          </span>
                          <button
                            onClick={() => handleCheckLink(product._id)}
                            disabled={isCheckingLink}
                            className="text-[10px] text-slate-500 hover:text-slate-800 underline disabled:opacity-50"
                          >
                            {isCheckingLink ? "Checking..." : "Re-check"}
                          </button>
                        </div>
                      )}
                      {product.linkStatus === "unchecked" && (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600">
                            <HelpCircle className="h-3 w-3" />
                            <span>Unchecked</span>
                          </span>
                          <button
                            onClick={() => handleCheckLink(product._id)}
                            disabled={isCheckingLink}
                            className="text-[10px] text-[#000072] hover:underline disabled:opacity-50"
                          >
                            {isCheckingLink ? "Checking..." : "Verify Link"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Catalog Status Toggle */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => handleToggleStatus(product)}
                      className="relative inline-flex items-center cursor-pointer disabled:opacity-50"
                    >
                      <div
                        className={`w-8 h-4 rounded-full transition-colors ${
                          product.isActive ? "bg-[#FB7C20]" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform transform mt-[1px] shadow-xs ${
                            product.isActive ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                      <span className="sr-only">Toggle catalog status</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onInspect(product)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-[#000072] hover:bg-[#000072]/10 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
