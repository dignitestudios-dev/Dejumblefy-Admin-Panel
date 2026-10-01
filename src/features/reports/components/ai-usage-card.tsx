"use client";

import { Sparkles, MessageSquare, Image as ImageIcon, MessagesSquare } from "lucide-react";
import { AIReportData } from "../types/reports.types";

interface AIUsageCardProps {
  data?: AIReportData;
}

export default function AIUsageCard({ data }: AIUsageCardProps) {
  if (!data) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">AI Engine & Image Workload</h3>
            <p className="text-[11px] text-slate-500">Conversational design requests & floorplan renderings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-[#000072] flex items-center justify-center gap-1">
            <MessagesSquare className="h-3 w-3" />
            <span>Chat Sessions</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-slate-900 font-mono">
            {data.chatsCount || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-[#000072] flex items-center justify-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>AI Prompts & Replies</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-[#000072] font-mono">
            {data.messagesCount || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <span className="text-[10px] uppercase font-semibold text-emerald-700 flex items-center justify-center gap-1">
            <ImageIcon className="h-3 w-3" />
            <span>Rendered Designs</span>
          </span>
          <div className="mt-1 text-2xl font-bold text-emerald-700 font-mono">
            {data.imagesCount || 0}
          </div>
        </div>
      </div>

      {data.mostActiveUsers && data.mostActiveUsers.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-slate-700">Most Active AI Organizers</span>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-semibold text-slate-600">
                <tr>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3 text-right">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.mostActiveUsers.slice(0, 5).map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-[150px]">
                      {user.name || "Customer"}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-500 text-[11px] truncate max-w-[180px]">
                      {user.email}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#000072]">
                      {user.messages ?? user.chats ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
