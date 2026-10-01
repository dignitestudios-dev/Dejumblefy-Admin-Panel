"use client";

import { useState, useEffect } from "react";
import { Bell, Loader2, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { useSettingsQuery } from "../api/settings.queries";
import { useUpdateSettingsMutation } from "../api/settings.mutations";

export default function NotificationSettingsCard() {
  const { data: settings, isLoading, isError, refetch } = useSettingsQuery();
  const updateMutation = useUpdateSettingsMutation();

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setNotificationEnabled(settings.notification ?? true);
    }
  }, [settings]);

  const handleToggle = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    const nextState = !notificationEnabled;
    setNotificationEnabled(nextState);

    try {
      await updateMutation.mutateAsync({ notification: nextState });
      setSuccessMessage(
        nextState
          ? "System notifications enabled successfully."
          : "System notifications disabled."
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setNotificationEnabled(!nextState); // rollback
      const error = err as { message?: string };
      setErrorMessage(error?.message || "Failed to update notification settings.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Notification Preferences</h3>
            <p className="text-xs text-slate-500">
              Manage system-wide broadcast alerts and user delivery channels
            </p>
          </div>
        </div>

        {updateMutation.isPending && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FB7C20]" />
            <span>Saving...</span>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-[#FB7C20]" />
          <span>Loading settings...</span>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span>Unable to retrieve settings from server.</span>
          </div>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-amber-100 px-2.5 py-1 font-semibold text-amber-800 hover:bg-amber-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Push Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:bg-slate-50">
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-bold text-slate-900">
                Push Notification Delivery
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Allow mobile application to deliver push notifications and automated campaign
                broadcasts to customer devices.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              disabled={updateMutation.isPending}
              aria-label="Toggle notifications"
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none ${
                notificationEnabled ? "bg-[#FB7C20]" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                  notificationEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Detailed preference items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
              <span className="text-xs font-semibold text-slate-800">Marketing & Campaigns</span>
              <p className="text-[11px] text-slate-500">
                Dispatches promotional announcements, discounts, and token bundle offers.
              </p>
              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    notificationEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {notificationEnabled ? "Enabled by Default" : "Paused"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
              <span className="text-xs font-semibold text-slate-800">Transactional Alerts</span>
              <p className="text-[11px] text-slate-500">
                Wallet token additions, purchase receipts, and referral conversions.
              </p>
              <div className="pt-2">
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    notificationEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {notificationEnabled ? "Enabled by Default" : "Paused"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
