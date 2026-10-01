import { Sparkles, Image, Zap, Users, Cpu } from "lucide-react";
import { DashboardAIUsage } from "../types/dashboard.types";

interface AIUsageCardProps {
  data?: DashboardAIUsage;
}

export default function AIUsageCard({ data }: AIUsageCardProps) {
  const images = data?.totalImagesUploaded ?? 0;
  const analyses = data?.totalAIAnalyses ?? 0;
  const aiUsers = data?.totalAIUsers ?? 0;
  const avgInteractions = data?.avgAIInteractionsPerUser ?? 0;
  const tokens = data?.totalTokensConsumed ?? 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000072]/10 text-[#000072] border border-[#000072]/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 tracking-tight text-sm">
              AI Declutter & Organizing Engine
            </h3>
            <p className="text-xs text-slate-500">Analysis & generative model metrics</p>
          </div>
        </div>
        <span className="rounded-full bg-[#000072]/10 px-2.5 py-1 text-xs font-semibold text-[#000072]">
          Active Space AI
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Sparkles className="h-4 w-4 text-[#FB7C20]" />
            <span>AI Analyses</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{analyses.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-slate-500">Completed space scans</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Image className="h-4 w-4 text-[#000072]" />
            <span>Images Uploaded</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{images.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-slate-500">User room & drawer photos</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Users className="h-4 w-4 text-emerald-600" />
            <span>AI Active Users</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{aiUsers.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-slate-500">{avgInteractions} avg turns/user</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Zap className="h-4 w-4 text-[#FB7C20]" />
            <span>Tokens Burned</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{tokens.toLocaleString()}</div>
          <p className="mt-1 text-[11px] text-slate-500">1 token per reply</p>
        </div>
      </div>
    </div>
  );
}
