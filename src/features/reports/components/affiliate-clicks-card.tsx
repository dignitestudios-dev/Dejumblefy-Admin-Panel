"use client";

import { MousePointerClick, Users, ShoppingBag, Store, ExternalLink } from "lucide-react";
import { ClicksReportData } from "../types/reports.types";

interface AffiliateClicksCardProps {
  data?: ClicksReportData;
}

export default function AffiliateClicksCard({ data }: AffiliateClicksCardProps) {
  if (!data) return null;

  const byRetailer = data.byRetailer || [];
  const products = (data.byProduct && data.byProduct.length > 0)
    ? data.byProduct
    : (data.topProducts || []);

  const totalClicks = data.totalClicks ?? products.reduce((acc, p) => acc + (p.clicks ?? p.clickCount ?? 0), 0);
  const totalUniqueUsers =
    byRetailer.length > 0
      ? byRetailer.reduce((acc, r) => acc + (r.uniqueUsers || 0), 0)
      : products.reduce((acc, p) => acc + (p.uniqueUsers ?? 0), 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100 shadow-2xs">
            <MousePointerClick className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Affiliate Clicks by Retailer</h3>
            <p className="text-xs text-slate-500">
              Measure outbound user click conversions across retail partners (Amazon, Target, Walmart, etc.)
            </p>
          </div>
        </div>
      </div>

      {/* Top Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Total Clicks */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <MousePointerClick className="h-3.5 w-3.5 text-[#FB7C20]" />
            <span>Total Outbound Clicks</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-[#FB7C20] font-mono">
            {(totalClicks || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Tracked outbound redirect clicks</p>
        </div>

        {/* Unique Shoppers */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#000072]" />
            <span>Unique Shoppers</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
            {(totalUniqueUsers || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Distinct user accounts clicked</p>
        </div>

        {/* Products Clicked */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
            <span>Products Clicked</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono">
            {products.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Distinct catalog items engaged</p>
        </div>
      </div>

      {/* Clicks by Retailer Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-[#000072]" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Retail Partner Share Breakdown
          </h4>
        </div>

        {byRetailer.length > 0 ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-2.5 px-4">Retailer</th>
                  <th className="py-2.5 px-4 text-center">Outbound Clicks</th>
                  <th className="py-2.5 px-4 text-center">Unique Users</th>
                  <th className="py-2.5 px-4 text-right">Traffic Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {byRetailer.map((ret) => {
                  const percentShare = Math.round((ret.share ?? 0) * 100);
                  const isAmazon = ret.retailer === "amazon";

                  return (
                    <tr key={ret.retailer} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-semibold border ${
                              isAmazon
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-teal-50 text-teal-800 border-teal-200"
                            }`}
                          >
                            {ret.retailerName || ret.retailer}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">/{ret.retailer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {ret.clicks}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600">
                        {ret.uniqueUsers}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                isAmazon ? "bg-[#FB7C20]" : "bg-[#000072]"
                              }`}
                              style={{ width: `${Math.min(100, Math.max(percentShare, 4))}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-900 w-10 text-right">
                            {percentShare}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No retailer click breakdown recorded for this time range.
          </div>
        )}
      </div>

      {/* Clicks by Product Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#FB7C20]" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Converting Products
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            {products.length} product{products.length !== 1 ? "s" : ""} clicked
          </span>
        </div>

        {products.length > 0 ? (
          <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-semibold text-slate-500">
                <tr>
                  <th className="py-2.5 px-4">Product Title</th>
                  <th className="py-2.5 px-4">Retailer</th>
                  <th className="py-2.5 px-4 text-center">Clicks</th>
                  <th className="py-2.5 px-4 text-center">Unique Users</th>
                  <th className="py-2.5 px-4 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.slice(0, 15).map((prod, idx) => {
                  const retName = prod.retailerName || prod.retailer || "Amazon";
                  const isAmazon = prod.retailer === "amazon" || !prod.retailer;
                  const clickCount = prod.clicks ?? prod.clickCount ?? 0;

                  return (
                    <tr key={prod.productId || prod._id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-4 max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 truncate" title={prod.title}>
                            {prod.title}
                          </span>
                          {prod.asin && (
                            <span className="font-mono text-[10px] text-slate-400">
                              ASIN: {prod.asin}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
                            isAmazon
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-teal-50 text-teal-800 border-teal-200"
                          }`}
                        >
                          {retName}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold text-[#FB7C20]">
                        {clickCount}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-600">
                        {prod.uniqueUsers ?? "-"}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {prod.defaultLink ? (
                          <a
                            href={prod.defaultLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                            title={`Open on ${retName}`}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Listing</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            No product click records found for this period.
          </div>
        )}
      </div>
    </div>
  );
}
