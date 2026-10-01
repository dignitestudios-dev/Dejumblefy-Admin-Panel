"use client";

import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Coins,
  Bell,
  Gift,
  BarChart3,
  Layers,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ActionItem {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    title: "Manage Users",
    description: "Search accounts, adjust tokens & view activity",
    href: "/dashboard/users",
    icon: Users,
    iconBg: "bg-blue-50 border-blue-100",
    iconColor: "text-[#000072]",
  },
  {
    title: "Amazon Products",
    description: "Inspect ASIN catalogs, links & tags",
    href: "/dashboard/products",
    icon: ShoppingBag,
    iconBg: "bg-orange-50 border-orange-100",
    iconColor: "text-[#FB7C20]",
  },
  {
    title: "Token Packs",
    description: "Configure IAP bundles & store product IDs",
    href: "/dashboard/token-packs",
    icon: Coins,
    iconBg: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Push Notifications",
    description: "Broadcast announcements & filter segments",
    href: "/dashboard/notifications",
    icon: Bell,
    iconBg: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "Referral Program",
    description: "Track conversions, referrers & reward tokens",
    href: "/dashboard/referrals",
    icon: Gift,
    iconBg: "bg-emerald-50 border-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Executive Reports",
    description: "Revenue charts, token burning & AI workloads",
    href: "/dashboard/reports",
    icon: BarChart3,
    iconBg: "bg-indigo-50 border-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    title: "Lookups Config",
    description: "Manage system categories, styles & materials",
    href: "/dashboard/lookups",
    icon: Layers,
    iconBg: "bg-sky-50 border-sky-100",
    iconColor: "text-sky-600",
  },
  {
    title: "Settings",
    description: "Platform security, API keys & preferences",
    href: "/dashboard/settings",
    icon: Settings,
    iconBg: "bg-slate-100 border-slate-200",
    iconColor: "text-slate-700",
  },
];

export default function QuickActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Admin Quick Actions</h3>
            <p className="text-xs text-slate-500">Fast shortcuts to frequently accessed administrative workflows</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:border-[#FB7C20]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${action.iconBg} ${action.iconColor} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:text-[#FB7C20] group-hover:translate-x-0.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#000072] transition-colors">
                  {action.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-snug">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
