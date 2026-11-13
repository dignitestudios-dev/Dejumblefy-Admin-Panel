"use client";

import { useState } from "react";
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
  AlertTriangle,
  X,
  Loader2,
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
    name: "Products",
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
    } catch {
      // Ignore API failure on logout
    } finally {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      document.cookie = `${STORAGE_KEYS.AUTH_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      dispatch(logout());
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
      window.location.href = AUTH_REDIRECT;
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white text-slate-700 shadow-sm">
      {/* Brand Header */}
      <div className="mx-auto">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src={logoImg}
            alt="Dejumblefy"
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
              <p className="truncate text-[11px] text-slate-500">{user?.email || "admin@dejumblefy.com"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            title="Log Out"
            aria-label="Log Out of Admin Panel"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                  <LogOut className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Confirm Logout</h3>
                  <p className="text-xs text-slate-500">Sign out of session</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to log out of the Admin Panel? You will need to sign in again to access the dashboard.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isLoggingOut && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Confirm Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
