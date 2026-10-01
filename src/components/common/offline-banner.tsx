"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg shadow-lg border border-slate-800 animate-in slide-in-from-bottom-2 duration-300"
    >
      <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
      <span>You are currently offline. Check your internet connection.</span>
    </div>
  );
}
