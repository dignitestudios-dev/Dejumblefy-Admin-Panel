"use client";

import { useState, useMemo } from "react";
import {
  Bell,
  Send,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Radio,
  Users,
} from "lucide-react";
import {
  AdminNotificationItem,
  NotificationsQueryParams,
} from "../types/notifications.types";
import { useAdminNotificationsQuery } from "../api/notifications.queries";
import NotificationsTable from "./notifications-table";
import SendNotificationModal from "./send-notification-modal";
import NotificationDetailModal from "./notification-detail-modal";

export default function NotificationsManagement() {
  const [params, setParams] = useState<NotificationsQueryParams>({
    page: 1,
    limit: 10,
  });

  const [isSendOpen, setIsSendOpen] = useState(false);
  const [inspectNotification, setInspectNotification] = useState<AdminNotificationItem | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminNotificationsQuery(params);

  const notifications = data?.data || [];
  const pagination = data?.pagination;

  const totalBroadcasts = pagination?.totalItems ?? notifications.length;

  // Computed summary metrics
  const totalSuccessDeliveries = useMemo(() => {
    return notifications.reduce(
      (acc, n) => acc + (n.sendStats?.success ?? n.sendStats?.tokens ?? 0),
      0
    );
  }, [notifications]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <span>Push Notifications Center</span>
            <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#000072] border border-blue-100">
              Firebase FCM
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch re-engagement alerts, token announcements, and segmented notifications to iOS & Android apps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh notifications"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#FB7C20]" : ""}`} />
          </button>

          <button
            onClick={() => setIsSendOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Send Push Alert</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Broadcasts */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Broadcasts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#FB7C20]">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">{totalBroadcasts}</div>
          <p className="text-[11px] text-slate-400 mt-1">Campaigns triggered from Admin panel</p>
        </div>

        {/* Deliveries Accepted */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Delivered Alerts</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
            {totalSuccessDeliveries}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Accepted by FCM for mobile delivery</p>
        </div>

        {/* Targeting Modes */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Targeting Modes</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#000072]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-900">
            Broadcast, Specific & Segment
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Wallet balance, purchase and signup filters</p>
        </div>
      </div>

      {/* Error alert */}
      {isError && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>
              {error instanceof Error ? error.message : "Failed to load notification history."}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* Notifications Table */}
      <NotificationsTable
        notifications={notifications}
        isLoading={isLoading}
        onInspect={(item) => setInspectNotification(item)}
        onAddNew={() => setIsSendOpen(true)}
      />

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-900">{pagination.currentPage}</span> of{" "}
            <span className="font-semibold text-slate-900">{pagination.totalPages}</span> (
            {pagination.totalItems} broadcasts total)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  page: Math.max(1, (prev.page || 1) - 1),
                }))
              }
              disabled={pagination.currentPage <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={() =>
                setParams((prev) => ({
                  ...prev,
                  page: Math.min(pagination.totalPages, (prev.page || 1) + 1),
                }))
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <SendNotificationModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
      />

      <NotificationDetailModal
        notification={inspectNotification}
        isOpen={!!inspectNotification}
        onClose={() => setInspectNotification(null)}
      />
    </div>
  );
}
