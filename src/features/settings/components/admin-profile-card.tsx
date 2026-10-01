"use client";

import { UserCheck, ShieldCheck, Mail, User, Calendar } from "lucide-react";
import { useAppSelector } from "@/store";

export default function AdminProfileCard() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Administrator Profile</h3>
            <p className="text-xs text-slate-500">Active session credentials and permissions</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Active Super Admin</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/60">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#000072] text-xl font-bold text-white shadow-xs">
          {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "A"}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {user?.name || "Administrator"}
            </h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-[#000072] border border-blue-200 uppercase tracking-wider self-center sm:self-auto">
              {user?.role || "admin"}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate flex items-center justify-center sm:justify-start gap-1">
            <Mail className="h-3 w-3 text-slate-400" />
            <span>{user?.email || "admin@dejumblify.com"}</span>
          </p>
        </div>
      </div>

      
    </div>
  );
}
