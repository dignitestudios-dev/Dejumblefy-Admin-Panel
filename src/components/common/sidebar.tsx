"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Layers,
  Coins,
  Bell,
  Gift,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import logoImg from "@/assets/logo.png";
import { cn } from "@/utils/cn";
import { useAppDispatch, useAppSelector } from "@/store";
import { logout } from "@/store/slices/auth.slice";
import { STORAGE_KEYS } from "@/utils/constants";
import { AUTH_REDIRECT } from "@/config/routes";
import { logoutAdmin } from "@/features/auth/api/auth.api";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Amazon Products",
    href: "/dashboard/products",
    icon: ShoppingBag,
  },
  {
    name: "Lookups",
    href: "/dashboard/lookups",
    icon: Layers,
  },
  {
    name: "Token Packs",
    href: "/dashboard/token-packs",
    icon: Coins,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    name: "Referrals",
    href: "/dashboard/referrals",
    icon: Gift,
  },
  // {
  //   name: "App Content",
  //   href: "/dashboard/content",
  //   icon: FileText,
  // },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Ignore API failure on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      dispatch(logout());
      router.push(AUTH_REDIRECT);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white text-slate-700 shadow-sm">
      {/* Brand Header */}
      <div className="mx-auto">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src={logoImg}
            alt="Dejumblify"
            className="h-30 w-30"
            priority
          />
        </Link>
      
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
       
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#000072] text-white shadow-sm shadow-[#000072]/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-[#FB7C20]" : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Admin User Profile & Logout Footer */}
      <div className="border-t border-slate-200 p-3 bg-slate-50/50">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#000072]/10 text-xs font-bold text-[#000072]">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="truncate font-semibold text-slate-900">{user?.name || "Administrator"}</p>
              <p className="truncate text-[11px] text-slate-500">{user?.email || "admin@dejumblify.com"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log Out of Admin Panel"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
