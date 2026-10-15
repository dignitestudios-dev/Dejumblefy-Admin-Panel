"use client";

import {
  X,
  Bell,
  Calendar,
  Users,
  Filter,
  User,
} from "lucide-react";
import { AdminNotificationItem } from "../types/notifications.types";

interface NotificationDetailModalProps {
  notification: AdminNotificationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
}: NotificationDetailModalProps) {
  if (!isOpen || !notification) return null;

  const segment = notification.audienceDetails?.segment;
  const userIds = notification.audienceDetails?.userIds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100 shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-900 truncate">Broadcast Delivery Log</h3>
              <p className="text-xs text-slate-500">Inspecting push dispatch details and delivery breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 min-w-0">
          {/* Notification Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#FB7C20] uppercase tracking-wider shrink-0">
                Push Alert
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 break-all leading-snug">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed break-all whitespace-pre-wrap">
              {notification.description || "No description provided"}
            </p>
          </div>

          {/* Delivery Stats Grid */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Delivery Metrics</span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">FCM Tokens</div>
                <div className="text-base font-bold text-[#000072] font-mono mt-0.5 break-all">
                  {notification.sendStats?.tokens ?? notification.sendStats?.sentCount ?? 0}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-emerald-600 uppercase font-semibold">Accepted</div>
                <div className="text-base font-bold text-emerald-600 font-mono mt-0.5 break-all">
                  {notification.sendStats?.success ?? 0}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-rose-600 uppercase font-semibold">Failed</div>
                <div className="text-base font-bold text-rose-600 font-mono mt-0.5 break-all">
                  {notification.sendStats?.failed ?? notification.sendStats?.failedCount ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3 shadow-2xs min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">Target Audience</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border capitalize inline-flex items-center gap-1 ${
                  notification.targetAudience === "all"
                    ? "bg-blue-50 text-[#000072] border-blue-100"
                    : notification.targetAudience === "users"
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {notification.targetAudience === "all" ? (
                  <>
                    <Users className="h-3 w-3" />
                    <span>All Active Users</span>
                  </>
                ) : notification.targetAudience === "users" ? (
                  <>
                    <User className="h-3 w-3" />
                    <span>Specific Target Users</span>
                  </>
                ) : (
                  <>
                    <Filter className="h-3 w-3" />
                    <span>Audience Segment</span>
                  </>
                )}
              </span>
            </div>

            {/* Segment Details */}
            {notification.targetAudience === "segment" && segment && (
              <div className="rounded-lg bg-slate-50 p-3 space-y-2 text-xs text-slate-600 border border-slate-200">
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-amber-600" />
                  <span>Segment Filters Applied:</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {segment.hasPurchased !== undefined && (
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Purchased Pack
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {segment.hasPurchased ? "Yes (Has Purchased)" : "No (Never Purchased)"}
                      </span>
                    </div>
                  )}
                  {segment.balance && (
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Token Balance
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block capitalize">
                        {segment.balance === "positive"
                          ? "Positive (> 0)"
                          : segment.balance === "zero"
                          ? "Zero (0)"
                          : segment.balance}
                      </span>
                    </div>
                  )}
                  {segment.signedUpFrom && (
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Signed Up From
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {segment.signedUpFrom}
                      </span>
                    </div>
                  )}
                  {segment.signedUpTo && (
                    <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                        Signed Up To
                      </span>
                      <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                        {segment.signedUpTo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Targeted User IDs */}
            {userIds && userIds.length > 0 && (
              <div className="rounded-lg bg-slate-50 p-2.5 space-y-1.5 text-xs text-slate-600 border border-slate-200">
                <p className="font-semibold text-slate-900 flex items-center justify-between">
                  <span>Targeted User IDs ({userIds.length}):</span>
                </p>
                <div className="max-h-28 overflow-y-auto font-mono text-[11px] text-slate-700 space-y-1 bg-white p-2 rounded border border-slate-200">
                  {userIds.map((uid) => (
                    <div key={uid} className="break-all select-all hover:text-[#FB7C20]">
                      {uid}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
