"use client";

import { useState, useMemo } from "react";
import { Search, X, Check, Users, Loader2, UserCheck, AlertCircle } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useUsersQuery } from "@/features/users/api/users.queries";

interface UserMultiSelectProps {
  selectedUserIds: string[];
  onChange: (ids: string[]) => void;
  rawTextValue: string;
  onRawTextChange: (text: string) => void;
}

export default function UserMultiSelect({
  selectedUserIds,
  onChange,
  rawTextValue,
  onRawTextChange,
}: UserMultiSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useUsersQuery({
    search: debouncedSearch.trim() || undefined,
    limit: 15,
  });

  const usersList = data?.data?.users || [];
  const [selectedUsers, setSelectedUsers] = useState<
  { _id: string; name: string | null; email: string }[]
>([]);
 const handleToggle = (user: {
  _id: string;
  name: string | null;
  email: string;
}) => {
  const isSelected = selectedUserIds.includes(user._id);

  if (isSelected) {
    onChange(selectedUserIds.filter((id) => id !== user._id));
    setSelectedUsers((prev) =>
      prev.filter((u) => u._id !== user._id)
    );
  } else {
    onChange([...selectedUserIds, user._id]);
    setSelectedUsers((prev) => [...prev, user]);
  }
};

  const handleRemove = (userId: string) => {
  onChange(selectedUserIds.filter((id) => id !== userId));
  setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
};

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-[#000072]" />
          <span>Select Recipient Users</span>
        </label>
        {selectedUserIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {selectedUserIds.length} selected
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-medium text-rose-600 hover:text-rose-800 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Selected Users Chips */}
    {selectedUsers.length > 0 && (
  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-white rounded-lg border border-slate-200">
    {selectedUsers.map((user) => (
      <span
        key={user._id}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#000072]/10 text-[#000072] text-[11px] font-medium"
      >
        <span className="max-w-[150px] truncate">
          {user.name || user.email}
        </span>

        <button
          type="button"
          onClick={() => handleRemove(user._id)}
          className="hover:text-rose-600"
          aria-label={`Remove ${user.name || user.email}`}
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}
  </div>
)}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user name or email..."
          className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#FB7C20] focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown List */}
      <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
        {isLoading ? (
          <div className="flex items-center justify-center p-3 text-xs text-slate-400 gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FB7C20]" />
            <span>Searching users...</span>
          </div>
        ) : isError ? (
          <div className="p-3 text-xs text-rose-500 text-center flex items-center justify-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Failed to load users</span>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-3 text-xs text-slate-400 text-center">
            {search ? "No users matching query" : "Type to search registered users"}
          </div>
        ) : (
          usersList.map((user) => {
            const isSelected = selectedUserIds.includes(user._id);
            return (
              <button
                type="button"
                key={user._id}
                onClick={() => handleToggle(user)}
                 className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                  }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-slate-900 truncate">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${isSelected
                      ? "bg-[#000072] border-[#000072] text-white"
                      : "border-slate-300 bg-white text-transparent"
                    }`}
                >
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Manual User IDs Textarea */}
    
    </div>
  );
}
