"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  FileSpreadsheet,
  Download,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  ProductItem,
  ProductsQueryParams,
  LinkStatus,
} from "../types/products.types";
import { useProductsQuery } from "../api/products.queries";
import { downloadCsvTemplate } from "../api/products.api";
import { useLookupsQuery } from "@/features/lookups/api/lookups.queries";
import ProductsTable from "./products-table";
import CreateProductModal from "./create-product-modal";
import EditProductModal from "./edit-product-modal";
import ProductDetailModal from "./product-detail-modal";
import DeleteProductModal from "./delete-product-modal";
import CsvImportModal from "./csv-import-modal";

export default function ProductsManagement() {
  const [filters, setFilters] = useState<ProductsQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    category: "",
    isActive: undefined,
    linkStatus: undefined,
  });

  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 400);

  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed !== (filters.search || "")) {
      setFilters((prev) => ({ ...prev, search: trimmed || undefined, page: 1 }));
    }
  }, [debouncedSearch]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<ProductItem | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useProductsQuery(filters);
  const { data: categories = [] } = useLookupsQuery({ type: "category", isActive: true });

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleCategoryChange = (val: string) => {
    setFilters((prev) => ({ ...prev, category: val || undefined, page: 1 }));
  };

  const handleLinkStatusChange = (val: LinkStatus | "all") => {
    setFilters((prev) => ({
      ...prev,
      linkStatus: val === "all" ? undefined : val,
      page: 1,
    }));
  };

  const handleStatusChange = (val: "all" | "active" | "inactive") => {
    setFilters((prev) => ({
      ...prev,
      isActive: val === "all" ? undefined : val === "active",
      page: 1,
    }));
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      await downloadCsvTemplate();
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Amazon Affiliate Products</span>
            <span className="rounded-lg bg-[#000072]/10 px-2.5 py-0.5 text-xs font-semibold text-[#000072]">
              Recommendation Pool
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage product recommendations, track Amazon affiliate links, and monitor health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh list"
            aria-label="Refresh product list"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>

          {/* <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={isDownloadingTemplate}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>CSV Template</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCsvImportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#000072]" />
            <span>Bulk Import</span>
          </button> */}

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Metric counters row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total in Catalog</span>
            <ShoppingBag className="h-4 w-4 text-[#000072]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {pagination?.totalItems ?? products.length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Affiliate items registered</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active / Live</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            {products.filter((p) => p.isActive).length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Live for AI recommendation</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Broken Links</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600">
            {products.filter((p) => p.linkStatus === "broken").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Requiring link replacement</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Healthy Status</span>
            <CheckCircle2 className="h-4 w-4 text-[#FB7C20]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            {products.filter((p) => p.linkStatus === "ok").length}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Verified links</div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            maxLength={100}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title, ASIN, or tag..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-[#FB7C20] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setFilters((prev) => ({ ...prev, search: undefined, page: 1 }));
              }}
              aria-label="Clear search input"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category filter */}
          <select
            value={filters.category || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Link status filter */}
          <select
            value={filters.linkStatus || "all"}
            onChange={(e) => handleLinkStatusChange(e.target.value as LinkStatus | "all")}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="all">All Link Statuses</option>
            <option value="ok">Healthy (OK)</option>
            <option value="broken">Broken Links</option>
            <option value="unchecked">Unchecked</option>
          </select>

          {/* Active status filter */}
          <select
            value={
              filters.isActive === true
                ? "active"
                : filters.isActive === false
                ? "inactive"
                : "all"
            }
            onChange={(e) => handleStatusChange(e.target.value as "all" | "active" | "inactive")}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 font-medium focus:border-[#FB7C20] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Main product table */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        onInspect={(p) => setInspectProduct(p)}
        onEdit={(p) => setEditProduct(p)}
        onDelete={(p) => setDeleteProduct(p)}
        onAddNew={() => setIsCreateOpen(true)}
      />

      {/* Pagination row */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs text-slate-600 shadow-xs">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-900">{pagination.totalItems}</span> products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
              disabled={pagination.currentPage <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <button
              onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <EditProductModal
        product={editProduct}
        isOpen={Boolean(editProduct)}
        onClose={() => setEditProduct(null)}
      />

      <ProductDetailModal
        product={inspectProduct}
        isOpen={Boolean(inspectProduct)}
        onClose={() => setInspectProduct(null)}
        onEdit={(p) => {
          setInspectProduct(null);
          setEditProduct(p);
        }}
      />

      <DeleteProductModal
        product={deleteProduct}
        isOpen={Boolean(deleteProduct)}
        onClose={() => setDeleteProduct(null)}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
      />
    </div>
  );
}
