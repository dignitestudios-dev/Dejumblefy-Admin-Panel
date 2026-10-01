"use client";

import { usePathname } from "next/navigation";
import { Search, Shield } from "lucide-react";
import { useAppSelector } from "@/store";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "System Overview",
  "/dashboard/users": "User Accounts",
  "/dashboard/products": "Amazon Product Catalog",
  "/dashboard/lookups": "Categories, Styles & Materials",
  "/dashboard/token-packs": "In-App Token Packages",
  "/dashboard/notifications": "Push Notifications",
  "/dashboard/referrals": "Referrals & Rewards",
  "/dashboard/content": "App Content & Policies",
  "/dashboard/reports": "Analytics & Export Reports",
  "/dashboard/settings": "Admin Settings",
};

export default function Header() {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const title =
    ROUTE_TITLES[pathname] ||
    pathname
      .replace("/dashboard", "")
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur-md shadow-xs">
      {/* Route Title & Breadcrumb */}
      <div>
        <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500">Dejumblify Administrator Portal</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
       

        {/* System Online Badge */}

        {/* Admin Tag */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700">
          <Shield className="h-3.5 w-3.5 text-[#000072]" />
          <span className="font-semibold text-slate-800">{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
