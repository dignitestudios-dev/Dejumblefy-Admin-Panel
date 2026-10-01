"use client";

import {
  X,
  Bell,
  Calendar,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Broadcast Delivery Log</h3>
              <p className="text-xs text-slate-500">Inspecting push dispatch details and delivery breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Notification Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#FB7C20] uppercase tracking-wider">
                Push Alert
              </span>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(notification.createdAt).toLocaleString()}</span>
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900">{notification.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {notification.description || "No description provided"}
            </p>
          </div>

          {/* Delivery Stats Grid */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Delivery Metrics</span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">FCM Tokens</div>
                <div className="text-base font-bold text-[#000072] font-mono mt-0.5">
                  {notification.sendStats?.tokens ?? notification.sendStats?.sentCount ?? 0}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-emerald-600 uppercase font-semibold">Accepted</div>
                <div className="text-base font-bold text-emerald-600 font-mono mt-0.5">
                  {notification.sendStats?.success ?? 0}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-2xs">
                <div className="text-[10px] text-rose-600 uppercase font-semibold">Failed</div>
                <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
                  {notification.sendStats?.failed ?? notification.sendStats?.failedCount ?? 0}
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Target Audience</span>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#000072] border border-blue-100 capitalize">
                {notification.targetAudience === "all"
                  ? "All Active Users"
                  : notification.targetAudience === "users"
                  ? "Specific Target Users"
                  : "Audience Segment"}
              </span>
            </div>

            {notification.audienceDetails?.segment && (
              <div className="rounded-lg bg-slate-50 p-2.5 space-y-1 text-xs text-slate-600 border border-slate-200">
                <p className="font-semibold text-slate-900">Segment Filters Applied:</p>
                {notification.audienceDetails.segment.hasPurchased !== undefined && (
                  <p>
                    Purchased Tokens:{" "}
                    <span className="text-slate-900 font-medium">
                      {notification.audienceDetails.segment.hasPurchased ? "Yes" : "No"}
                    </span>
                  </p>
                )}
                {notification.audienceDetails.segment.balance && (
                  <p>
                    Token Balance:{" "}
                    <span className="text-slate-900 font-medium">
                      {notification.audienceDetails.segment.balance}
                    </span>
                  </p>
                )}
                {notification.audienceDetails.segment.signedUpFrom && (
                  <p>
                    Signed Up From:{" "}
                    <span className="text-slate-900 font-medium">
                      {notification.audienceDetails.segment.signedUpFrom}
                    </span>
                  </p>
                )}
                {notification.audienceDetails.segment.signedUpTo && (
                  <p>
                    Signed Up To:{" "}
                    <span className="text-slate-900 font-medium">
                      {notification.audienceDetails.segment.signedUpTo}
                    </span>
                  </p>
                )}
              </div>
            )}

            {notification.audienceDetails?.userIds && (
              <div className="rounded-lg bg-slate-50 p-2.5 space-y-1 text-xs text-slate-600 border border-slate-200">
                <p className="font-semibold text-slate-900">
                  Targeted User IDs ({notification.audienceDetails.userIds.length}):
                </p>
                <div className="max-h-24 overflow-y-auto font-mono text-[11px] text-slate-700 space-y-0.5">
                  {notification.audienceDetails.userIds.map((uid) => (
                    <div key={uid}>{uid}</div>
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
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
