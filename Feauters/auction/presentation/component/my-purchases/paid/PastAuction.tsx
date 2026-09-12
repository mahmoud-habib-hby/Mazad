"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

import { UsePaidAuction } from "../../../hooks/usePaidAuction";

import { UseThemStor } from "@/stor/themStor";

export default function PastAuctions() {
  const {
    mutate,
    data: auctions,
    isPending,
    isError,
    error,
  } = UsePaidAuction();

  const isDark = UseThemStor((state) => state.isDark);

  useEffect(() => {
    const loadAuctions = async () => {
      const supabase = await createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("USER ERROR:", error);
        return;
      }

      mutate(user.id);
    };

    loadAuctions();
  }, [mutate]);

  if (isPending) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#f5efe6]"
        }`}
      >
        <p
          className={`text-lg ${
            isDark ? "text-gray-400" : "text-[#5f5145]"
          }`}
        >
          جاري تحميل مزاداتك...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#f5efe6]"
        }`}
      >
        <div
          className={`rounded-2xl border p-8 text-center ${
            isDark
              ? "border-[#1f2923] bg-[#0b100d]"
              : "border-[#e5d8c8] bg-[#fffaf3]"
          }`}
        >
          <p className="font-medium text-red-500">
            {error instanceof Error
              ? error.message
              : "حدث خطأ أثناء تحميل المزادات"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen px-5 py-10 transition-colors duration-300 ${
        isDark
          ? "bg-[#050706] text-white"
          : "bg-[#f5efe6] text-[#3d342c]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1
            className={`text-3xl font-bold md:text-4xl ${
              isDark ? "text-white" : "text-[#3d342c]"
            }`}
          >
            مزاداتي
          </h1>

          <p
            className={`mt-2 ${
              isDark ? "text-gray-500" : "text-[#7b6d5f]"
            }`}
          >
            المزادات التي قمت بشرائها والدفع مقابلها
          </p>
        </div>

        {(!auctions || auctions.length === 0) && (
          <div
            className={`rounded-2xl border p-12 text-center ${
              isDark
                ? "border-[#1f2923] bg-[#0b100d]"
                : "border-[#e5d8c8] bg-[#fffaf3]"
            }`}
          >
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full ${
                isDark
                  ? "bg-[#22c55e]/10 text-[#22c55e]"
                  : "bg-[#f0e7dc] text-[#8b7a6a]"
              }`}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h12M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
            </div>

            <h2
              className={`mb-2 text-xl font-bold ${
                isDark ? "text-white" : "text-[#3d342c]"
              }`}
            >
              لا توجد مزادات مشتراة
            </h2>

            <p
              className={
                isDark ? "text-gray-500" : "text-[#7b6d5f]"
              }
            >
              لم تقم بشراء أي مزاد حتى الآن.
            </p>
          </div>
        )}

        {auctions && auctions.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {auctions.map((auction) => {
              const image = auction.images?.[0];

              return (
                <div
                  key={auction.id}
                  className={`group overflow-hidden rounded-2xl border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isDark
                      ? "border-[#1f2923] bg-[#0b100d] hover:border-[#315c45]"
                      : "border-[#e5d8c8] bg-[#fffaf3]"
                  }`}
                >
                  <div
                    className={`relative h-56 w-full overflow-hidden ${
                      isDark ? "bg-[#101713]" : "bg-[#eee5da]"
                    }`}
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={auction.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full flex-col items-center justify-center ${
                          isDark
                            ? "text-gray-600"
                            : "text-[#9a8978]"
                        }`}
                      >
                        <svg
                          className="mb-2 h-12 w-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                          />
                        </svg>

                        <span className="text-sm">
                          لا توجد صورة
                        </span>
                      </div>
                    )}

                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                          isDark
                            ? "bg-[#22c55e]/15 text-[#4ade80]"
                            : "bg-[#6b4f3a] text-white"
                        }`}
                      >
                        تم الشراء
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2
                      className={`mb-2 truncate text-xl font-bold ${
                        isDark ? "text-white" : "text-[#3d342c]"
                      }`}
                    >
                      {auction.title}
                    </h2>

                    <p
                      className={`line-clamp-2 min-h-[48px] text-sm leading-6 ${
                        isDark
                          ? "text-gray-500"
                          : "text-[#7b6d5f]"
                      }`}
                    >
                      {auction.description ||
                        "لا يوجد وصف للمزاد"}
                    </p>

                    <div
                      className={`mt-4 flex items-center justify-between border-b pb-4 ${
                        isDark
                          ? "border-[#1f2923]"
                          : "border-[#eadfd2]"
                      }`}
                    >
                      <span
                        className={
                          isDark
                            ? "text-sm text-gray-600"
                            : "text-sm text-[#9a8978]"
                        }
                      >
                        القسم
                      </span>

                      <span
                        className={`text-sm font-semibold ${
                          isDark
                            ? "text-gray-300"
                            : "text-[#4b3c31]"
                        }`}
                      >
                        {auction.category}
                      </span>
                    </div>

                    <div className="py-4">
                      <p
                        className={`mb-1 text-sm ${
                          isDark
                            ? "text-gray-600"
                            : "text-[#9a8978]"
                        }`}
                      >
                        سعر الشراء
                      </p>

                      <p
                        className={`text-2xl font-bold ${
                          isDark
                            ? "text-[#4ade80]"
                            : "text-[#6b4f3a]"
                        }`}
                      >
                        {auction.current_price.toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                        isDark
                          ? "bg-[#101713]"
                          : "bg-[#f7f0e8]"
                      }`}
                    >
                      <span
                        className={
                          isDark
                            ? "text-sm text-gray-500"
                            : "text-sm text-[#7b6d5f]"
                        }
                      >
                        حالة المزاد
                      </span>

                      <span
                        className={`text-sm font-bold ${
                          isDark
                            ? "text-[#4ade80]"
                            : "text-[#3d342c]"
                        }`}
                      >
                        تم الشراء
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}