"use client";

import { useState } from "react";
import { UseAddBids } from "../../hooks/useAddBids";

interface AddBidsProps {
  auctionId: string;
  currentPrice: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddBids({
  auctionId,
  currentPrice,
  onClose,
  onSuccess,
}: AddBidsProps) {
  const [bidAmount, setBidAmount] = useState("");

  const { mutate, isPending, isError, error } = UseAddBids();

  // نتأكد أن السعر رقم
  const safeCurrentPrice = Number(currentPrice) || 0;

  const minimumBid = safeCurrentPrice + 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(bidAmount);

    if (!amount || amount < minimumBid) {
      return;
    }

    mutate(
      {
        auctionId,
        bidAmount: Number(bidAmount),
      },
      {
        onSuccess: () => {
          window.location.reload();
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-full max-w-md rounded-3xl border border-[#18231d] bg-[#0a0d0b] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              تقديم مزايدة
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              أدخل المبلغ الذي تريد المزايدة به
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#18231d] bg-[#0d120f] text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* Current Price */}
        <div className="mb-5 rounded-2xl border border-[#18231d] bg-[#080b09] p-4">
          <p className="text-sm text-gray-500">
            السعر الحالي
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-black text-[#4ade80]">
              {safeCurrentPrice.toLocaleString("en-US")}
            </span>

            <span className="pb-1 text-sm text-gray-600">
              EGP
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="bidAmount"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            قيمة المزايدة
          </label>

          <input
            id="bidAmount"
            type="number"
            min={minimumBid}
            step="0.01"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder={`أقل مبلغ ${minimumBid}`}
            className="w-full rounded-2xl border border-[#18231d] bg-[#080b09] px-4 py-4 text-white outline-none transition placeholder:text-gray-700 focus:border-[#22c55e]"
          />

          <p className="mt-2 text-xs text-gray-600">
            أقل مزايدة مسموحة:{" "}
            <span className="text-[#4ade80]">
              {minimumBid.toLocaleString("en-US")} EGP
            </span>
          </p>

          {/* Error */}
          {isError && (
            <div className="mt-4 rounded-xl border border-red-900/40 bg-red-500/5 p-3 text-sm text-red-400">
              {error instanceof Error
                ? error.message
                : "حدث خطأ أثناء تقديم المزايدة"}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-[#18231d] bg-[#0d120f] px-5 py-4 font-semibold text-gray-400 transition hover:bg-[#111812] hover:text-white"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={
                isPending ||
                !bidAmount ||
                Number(bidAmount) < minimumBid
              }
              className="flex-1 rounded-2xl bg-[#22c55e] px-5 py-4 font-bold text-black transition hover:bg-[#4ade80] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isPending ? "جاري التقديم..." : "تأكيد المزايدة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}