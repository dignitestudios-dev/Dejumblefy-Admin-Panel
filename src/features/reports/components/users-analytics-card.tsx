"use client";

import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { UserReportData } from "../types/reports.types";

interface UsersAnalyticsCardProps {
  data?: UserReportData;
}

export default function UsersAnalyticsCard({ data }: UsersAnalyticsCardProps) {
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#000072] border border-blue-100">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">User Base & Customer Cohorts</h3>
            <p className="text-[11px] text-slate-500">Account acquisition, active sessions, and bans</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            <span>Total Accounts</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {data.totalUsers || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <UserPlus className="h-3 w-3" />
            <span>New Signups</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-emerald-700 font-mono">
            +{data.newUsers || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-[#000072] flex items-center justify-center gap-1">
            <UserCheck className="h-3 w-3" />
            <span>Active Users</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-[#000072] font-mono">
            {data.activeUsers || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-rose-700 flex items-center justify-center gap-1">
            <UserX className="h-3 w-3" />
            <span>Suspended</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-rose-700 font-mono">
            {data.suspendedUsers || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
