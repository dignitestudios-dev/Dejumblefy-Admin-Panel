"use client";

import { MousePointerClick, ExternalLink, ShoppingBag } from "lucide-react";
import { ClicksReportData } from "../types/reports.types";

interface AffiliateClicksCardProps {
  data?: ClicksReportData;
}

export default function AffiliateClicksCard({ data }: AffiliateClicksCardProps) {
  if (!data) return null;

  const topProducts = data.topProducts ?? [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
            <MousePointerClick className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Affiliate Outbound Clicks</h3>
            <p className="text-[11px] text-slate-500">
              User conversions routed to Amazon storefront listings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
          <span className="text-slate-500 font-medium">Total Tracked:</span>
          <span className="font-bold text-slate-900 font-mono">
            {(data.totalClicks || 0).toLocaleString()} clicks
          </span>
        </div>
      </div>

      {topProducts.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          No affiliate click activity recorded in this period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase text-slate-400">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">ASIN</th>
                <th className="py-2.5 px-3 text-center">Clicks</th>
                <th className="py-2.5 px-3 text-right">Affiliate Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {topProducts.map((prod) => (
                <tr key={prod._id || prod.asin} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5 max-w-md">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="h-9 w-9 rounded-lg border border-slate-200 object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-400 shrink-0">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                      <span className="font-medium text-slate-900 truncate" title={prod.title}>
                        {prod.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                    {prod.asin}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#FB7C20] border border-orange-200">
                      {prod.clickCount}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {prod.defaultLink ? (
                      <a
                        href={prod.defaultLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#000072] hover:text-[#FB7C20] transition-colors"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
