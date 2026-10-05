"use client";

import { MousePointerClick, Users, ShoppingBag } from "lucide-react";
import { ClicksReportData } from "../types/reports.types";

interface AffiliateClicksCardProps {
  data?: ClicksReportData;
}

export default function AffiliateClicksCard({ data }: AffiliateClicksCardProps) {
  if (!data) return null;

  const products = (data.byProduct && data.byProduct.length > 0)
    ? data.byProduct
    : (data.topProducts || []);

  const totalClicks = data.totalClicks ?? products.reduce((acc, p) => acc + (p.clicks ?? p.clickCount ?? 0), 0);
  const totalUniqueUsers = products.reduce((acc, p) => acc + (p.uniqueUsers ?? 0), 0);

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
              User product conversions routed to Amazon storefront listings
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        {/* Total Clicks */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <MousePointerClick className="h-3 w-3 text-[#FB7C20]" />
            <span>Total Clicks</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-[#FB7C20] font-mono">
            {(totalClicks || 0).toLocaleString()}
          </div>
        </div>

        {/* Unique Shoppers */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Users className="h-3 w-3 text-[#000072]" />
            <span>Unique Shoppers</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {totalUniqueUsers > 0 ? totalUniqueUsers : 0}
          </div>
        </div>

        {/* Products Clicked */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <ShoppingBag className="h-3 w-3 text-[#000072]" />
            <span>Products Clicked</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {products.length}
          </div>
        </div>
      </div>
    </div>
  );
}
