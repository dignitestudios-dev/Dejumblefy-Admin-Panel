"use client";

import { Settings, Shield, Bell, KeyRound, Server } from "lucide-react";
import AdminProfileCard from "./admin-profile-card";
import NotificationSettingsCard from "./notification-settings-card";
import ChangePasswordCard from "./change-password-card";
import SystemInfoCard from "./system-info-card";

export default function SettingsManagement() {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#000072]/10 text-[#000072]">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Admin & System Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Configure application broadcast preferences, master credentials, and infrastructure parameters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
            <Shield className="h-3.5 w-3.5 text-[#000072]" />
            <span>Admin Control Panel</span>
          </div>
        </div>
      </div>

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 gap-6">
        {/* Administrator Identity */}
        <AdminProfileCard />

        {/* System & Push Notification Preferences */}
        {/* <NotificationSettingsCard /> */}

        {/* Admin Password Change Form */}
        <ChangePasswordCard />

        {/* Infrastructure & System Environment Info */}
        {/* <SystemInfoCard /> */}
      </div>
    </div>
  );
}
