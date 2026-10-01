"use client";

import { useState } from "react";
import { Coins, X, Loader2, AlertCircle } from "lucide-react";
import { useCreateTokenPackMutation } from "../api/token-packs.mutations";

interface CreateTokenPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTokenPackModal({
  isOpen,
  onClose,
}: CreateTokenPackModalProps) {
  const [name, setName] = useState("");
  const [token, setToken] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [storeProductIdApple, setStoreProductIdApple] = useState("");
  const [storeProductIdGoogle, setStoreProductIdGoogle] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateTokenPackMutation(() => {
    handleReset();
    onClose();
  });

  if (!isOpen) return null;

  const handleReset = () => {
    setName("");
    setToken("");
    setPrice("");
    setDescription("");
    setStoreProductIdApple("");
    setStoreProductIdGoogle("");
    setSortOrder(0);
    setIsActive(true);
    setErrorMessage(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Pack name is required.");
      return;
    }

    if (token === "" || Number(token) <= 0) {
      setErrorMessage("Token amount must be greater than 0.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        name: trimmedName,
        token: Number(token),
        price: price !== "" ? Number(price) : undefined,
        description: description.trim() || undefined,
        storeProductIdApple: storeProductIdApple.trim() || undefined,
        storeProductIdGoogle: storeProductIdGoogle.trim() || undefined,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Failed to create token pack."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-[#FB7C20] border border-orange-100">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Add Token Pack</h3>
              <p className="text-xs text-slate-500">
                Configure a new token bundle available in app stores
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Package Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Starter Pack, Power Pack"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Token Count <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={token}
                onChange={(e) => setToken(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 500"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price (USD $)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 4.99"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description displayed to the user..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Apple Store Product ID
              </label>
              <input
                type="text"
                value={storeProductIdApple}
                onChange={(e) => setStoreProductIdApple(e.target.value)}
                placeholder="com.dejumblify.token500"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 font-mono focus:border-[#FB7C20] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Google Play Product ID
              </label>
              <input
                type="text"
                value={storeProductIdGoogle}
                onChange={(e) => setStoreProductIdGoogle(e.target.value)}
                placeholder="dejumblify_tokens_500"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 font-mono focus:border-[#FB7C20] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#FB7C20] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="createIsActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#FB7C20] focus:ring-[#FB7C20]"
              />
              <label htmlFor="createIsActive" className="text-xs font-medium text-slate-700">
                Active in Store Catalog
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#FB7C20] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#E86B12] transition-colors disabled:opacity-50"
            >
              {createMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Create Package</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
