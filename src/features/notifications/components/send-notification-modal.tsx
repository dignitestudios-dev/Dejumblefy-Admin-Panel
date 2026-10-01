"use client";

import { useState } from "react";
import {
  X,
  Bell,
  Send,
  Filter,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  TargetAudience,
  BalanceFilter,
  SendAdminNotificationResponse,
} from "../types/notifications.types";
import { useSendAdminNotificationMutation } from "../api/notifications.mutations";
import UserMultiSelect from "./user-multi-select";

interface SendNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SendNotificationModal({
  isOpen,
  onClose,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userIdsText, setUserIdsText] = useState("");

  // Segment filters
  const [hasPurchased, setHasPurchased] = useState<"all" | "true" | "false">("all");
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter | "all">("all");
  const [signedUpFrom, setSignedUpFrom] = useState("");
  const [signedUpTo, setSignedUpTo] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deliveryResult, setDeliveryResult] = useState<SendAdminNotificationResponse["data"] | null>(
    null
  );

  const sendMutation = useSendAdminNotificationMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setDeliveryResult(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMsg("Notification title is required.");
      return;
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setErrorMsg("Notification message is required.");
      return;
    }

    let userIds: string[] | undefined = undefined;
    if (targetAudience === "users") {
      let finalIds = selectedUserIds;
      if (finalIds.length === 0 && userIdsText.trim()) {
        finalIds = userIdsText
          .split(/[\n, ]+/)
          .map((id) => id.trim())
          .filter((id) => id.length === 24);
      }
      if (finalIds.length === 0) {
        setErrorMsg("Please select at least one recipient user from the list or enter a valid User ID.");
        return;
      }
      userIds = finalIds;
    }

    let segment = undefined;
    if (targetAudience === "segment") {
      segment = {
        ...(hasPurchased !== "all" ? { hasPurchased: hasPurchased === "true" } : {}),
        ...(balanceFilter !== "all" ? { balance: balanceFilter } : {}),
        ...(signedUpFrom ? { signedUpFrom } : {}),
        ...(signedUpTo ? { signedUpTo } : {}),
      };
    }

    try {
      const result = await sendMutation.mutateAsync({
        title: trimmedTitle,
        description: trimmedDesc,
        targetAudience,
        userIds,
        segment,
      });

      setDeliveryResult(result);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMsg(
        error?.response?.data?.message || error?.message || "Failed to send push notification."
      );
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setTargetAudience("all");
    setSelectedUserIds([]);
    setUserIdsText("");
    setHasPurchased("all");
    setBalanceFilter("all");
    setSignedUpFrom("");
    setSignedUpTo("");
    setErrorMsg(null);
    setDeliveryResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Broadcast Push Notification</h3>
              <p className="text-xs text-slate-500">
                Dispatch targeted alerts to mobile device notification centers
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Delivery Success Banner */}
          {deliveryResult && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Push notification broadcast dispatched successfully!</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px] font-semibold">Target Users</div>
                  <div className="font-bold text-slate-900 font-mono">{deliveryResult.recipients}</div>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px] font-semibold">Tokens Dispatched</div>
                  <div className="font-bold text-[#000072] font-mono">{deliveryResult.tokens}</div>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                  <div className="text-emerald-700 text-[10px] font-semibold">FCM Accepted</div>
                  <div className="font-bold text-emerald-700 font-mono">{deliveryResult.success}</div>
                </div>
                <div className="rounded-lg bg-white p-2 border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-[10px] font-semibold">Failed</div>
                  <div className="font-bold text-slate-700 font-mono">{deliveryResult.failed}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Form Fields */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
              {/* Target Audience Tabs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all" as TargetAudience, label: "All Users" },
                    { id: "users" as TargetAudience, label: "Specific Users" },
                    { id: "segment" as TargetAudience, label: "User Segment" },
                  ].map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setTargetAudience(tab.id)}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                        targetAudience === tab.id
                          ? "border-[#000072] bg-[#000072] text-white shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific User Selector */}
              {targetAudience === "users" && (
                <UserMultiSelect
                  selectedUserIds={selectedUserIds}
                  onChange={setSelectedUserIds}
                  rawTextValue={userIdsText}
                  onRawTextChange={setUserIdsText}
                />
              )}

              {/* Segment Criteria Filters */}
              {targetAudience === "segment" && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-3 animate-in fade-in">
                  <span className="text-xs font-semibold text-[#000072] flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    <span>Segment Audience Criteria</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Token Purchases
                      </label>
                      <select
                        value={hasPurchased}
                        onChange={(e) =>
                          setHasPurchased(e.target.value as "all" | "true" | "false")
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
                      >
                        <option value="all">Any User</option>
                        <option value="true">Has Purchased Pack</option>
                        <option value="false">Never Purchased</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Wallet Token Balance
                      </label>
                      <select
                        value={balanceFilter}
                        onChange={(e) =>
                          setBalanceFilter(e.target.value as BalanceFilter | "all")
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
                      >
                        <option value="all">Any Balance</option>
                        <option value="zero">Zero Balance (0)</option>
                        <option value="positive">Positive Balance (&gt;0)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Signed Up From
                      </label>
                      <input
                        type="date"
                        value={signedUpFrom}
                        onChange={(e) => setSignedUpFrom(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Signed Up To
                      </label>
                      <input
                        type="date"
                        value={signedUpTo}
                        onChange={(e) => setSignedUpTo(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-[#FB7C20] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Notification Title <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{title.length}/100</span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. 50% Off Spring Token Sale "
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20]"
                />
              </div>

              {/* Description / Message Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Message Body <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">{description.length}/300</span>
                </div>
                <textarea
                  rows={4}
                  required
                  maxLength={300}
                  placeholder="e.g. Organize your wardrobe and pantry today! Use your bonus tokens to get tailored AI floorplans."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#FB7C20] focus:outline-none focus:ring-1 focus:ring-[#FB7C20] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#FB7C20] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors disabled:opacity-50"
                >
                  {sendMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Broadcast via Firebase FCM...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Dispatch Broadcast Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Live Mobile Push Simulator Preview */}
           
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
