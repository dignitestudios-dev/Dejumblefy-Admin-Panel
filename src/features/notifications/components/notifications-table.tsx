"use client";

import {
  Bell,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Users,
  Filter,
  User,
  Loader2,
} from "lucide-react";
import { AdminNotificationItem } from "../types/notifications.types";

interface NotificationsTableProps {
  notifications: AdminNotificationItem[];
  isLoading: boolean;
  onInspect: (notification: AdminNotificationItem) => void;
  onAddNew: () => void;
}

function renderTargetAudienceCell(item: AdminNotificationItem) {
  if (item.targetAudience === "all") {
    return (
      <div className="flex flex-col gap-1 min-w-[140px]">
        <div className="inline-flex items-center gap-1.5 w-fit rounded-lg bg-blue-50 px-2 py-0.5 text-xs border border-blue-200 font-medium text-[#000072]">
          <Users className="h-3 w-3 text-[#000072]" />
          <span>All Users</span>
        </div>
        <span className="text-[11px] text-slate-500">All active users</span>
      </div>
    );
  }

  if (item.targetAudience === "users") {
    const userIds = item.audienceDetails?.userIds || [];
    const count = userIds.length;

    return (
      <div className="flex flex-col gap-1 min-w-[160px] max-w-[220px]">
        <div className="inline-flex items-center gap-1.5 w-fit rounded-lg bg-purple-50 px-2 py-0.5 text-xs border border-purple-200 font-medium text-purple-700">
          <User className="h-3 w-3 text-purple-600" />
          <span>Target Users ({count > 0 ? count : 1})</span>
        </div>
        {userIds.length > 0 ? (
          <div className="font-mono text-[11px] text-slate-600 leading-tight space-y-0.5">
            {userIds.slice(0, 2).map((uid) => (
              <span
                key={uid}
                title={uid}
                className="block truncate break-all max-w-[200px] hover:text-slate-900 select-all"
              >
                {uid}
              </span>
            ))}
            {userIds.length > 2 && (
              <span className="text-[10px] text-slate-400 font-sans block">
                +{userIds.length - 2} more ID{userIds.length - 2 > 1 ? "s" : ""}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">User ID list</span>
        )}
      </div>
    );
  }

  if (item.targetAudience === "segment") {
    const segment = item.audienceDetails?.segment;
    const filterPills: { label: string; value: string }[] = [];

    if (segment?.hasPurchased !== undefined) {
      filterPills.push({
        label: "Purchases",
        value: segment.hasPurchased ? "Yes" : "No",
      });
    }
    if (segment?.balance) {
      filterPills.push({
        label: "Balance",
        value:
          segment.balance === "positive"
            ? "> 0"
            : segment.balance === "zero"
            ? "0"
            : segment.balance,
      });
    }
    if (segment?.signedUpFrom || segment?.signedUpTo) {
      if (segment.signedUpFrom && segment.signedUpTo) {
        filterPills.push({
          label: "Signup",
          value: `${segment.signedUpFrom} → ${segment.signedUpTo}`,
        });
      } else if (segment.signedUpFrom) {
        filterPills.push({
          label: "From",
          value: segment.signedUpFrom,
        });
      } else if (segment.signedUpTo) {
        filterPills.push({
          label: "To",
          value: segment.signedUpTo,
        });
      }
    }

    return (
      <div className="flex flex-col gap-1 min-w-[170px] max-w-[240px]">
        <div className="inline-flex items-center gap-1.5 w-fit rounded-lg bg-amber-50 px-2 py-0.5 text-xs border border-amber-200 font-medium text-amber-800">
          <Filter className="h-3 w-3 text-amber-700" />
          <span>User Segment</span>
        </div>
        {filterPills.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {filterPills.map((pill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 border border-slate-200 break-all"
              >
                <span className="text-slate-500">{pill.label}:</span>
                <span className="font-semibold text-slate-800">{pill.value}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">Custom user segment</span>
        )}
      </div>
    );
  }

  return (
    <span className="text-xs text-slate-500 capitalize">{item.targetAudience}</span>
  );
}

export default function NotificationsTable({
  notifications,
  isLoading,
  onInspect,
  onAddNew,
}: NotificationsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#FB7C20] mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading push notification history...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100 mb-3">
          <Bell className="h-6 w-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-900 mb-1">No push broadcasts sent yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          Broadcast promotional alerts, product drops, or re-engagement reminders to your customers.
        </p>
        <button
          onClick={onAddNew}
          className="inline-flex items-center gap-2 rounded-lg bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors cursor-pointer"
        >
          <Bell className="h-4 w-4" />
          <span>Compose First Notification</span>
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Broadcast Title & Message</th>
              <th className="py-3 px-4">Target Audience</th>
              <th className="py-3 px-4 text-center">Delivery Status</th>
              <th className="py-3 px-4 text-center">Dispatched / Success</th>
              <th className="py-3 px-4">Sent At</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {notifications.map((item) => {
              const dispatched =
                item.sendStats?.tokens ?? item.sendStats?.sentCount ?? 0;
              const success = item.sendStats?.success ?? dispatched;

              return (
                <tr
                  key={item._id}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  {/* Title & Preview */}
                  <td className="py-3 px-4 max-w-sm min-w-[200px]">
                    <div className="flex flex-col min-w-0">
                      <span
                        className="font-semibold text-slate-900 group-hover:text-[#FB7C20] transition-colors truncate break-all"
                        title={item.title}
                      >
                        {item.title}
                      </span>
                      {item.description && (
                        <span
                          className="text-xs text-slate-500 line-clamp-2 mt-0.5 break-all"
                          title={item.description}
                        >
                          {item.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Target Audience */}
                  <td className="py-3 px-4 align-top">
                    {renderTargetAudienceCell(item)}
                  </td>

                  {/* Delivery Status Badge */}
                  <td className="py-3 px-4 text-center align-top">
                    {item.status === "failed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <AlertTriangle className="h-3 w-3" />
                        <span>Failed</span>
                      </span>
                    ) : item.status === "partial" ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span>Partial</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Sent</span>
                      </span>
                    )}
                  </td>

                  {/* Dispatched vs Success */}
                  <td className="py-3 px-4 text-center align-top">
                    <div className="inline-flex items-center gap-1 font-mono text-xs">
                      <span className="text-emerald-700 font-bold">{success}</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-slate-600">{dispatched}</span>
                    </div>
                  </td>

                  {/* Sent Date */}
                  <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap align-top">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right align-top">
                    <button
                      onClick={() => onInspect(item)}
                      title="Inspect Dispatch Breakdown"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#000072]" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
