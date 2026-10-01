"use client";

import { Server, Globe, Cpu, Shield, Activity } from "lucide-react";
import { API_BASE_URL, SOCKET_URL } from "@/utils/constants";

export default function SystemInfoCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">System Environment & Infrastructure</h3>
            <p className="text-xs text-slate-500">Service connectivity, API gateways, and deployment metadata</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Operational</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span>API Gateway</span>
          </span>
          <div className="font-mono text-xs text-slate-900 font-semibold truncate" title={API_BASE_URL}>
            {API_BASE_URL}
          </div>
          <p className="text-[11px] text-slate-500">RESTful Express & Mongoose core</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span>Socket Transport</span>
          </span>
          <div className="font-mono text-xs text-slate-900 font-semibold truncate" title={SOCKET_URL}>
            {SOCKET_URL}
          </div>
          <p className="text-[11px] text-slate-500">Real-time chat & telemetry</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
            <Cpu className="h-3 w-3 text-slate-500" />
            <span>Frontend Engine</span>
          </span>
          <div className="font-mono text-xs text-slate-900 font-semibold">
            Next.js 15.5 • React 19
          </div>
          <p className="text-[11px] text-slate-500">Optimized with React Compiler</p>
        </div>
      </div>
    </div>
  );
}
