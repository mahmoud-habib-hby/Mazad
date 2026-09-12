"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UseMyAuctionPaid } from "../../../hooks/UseMyAuctionPaid";
import { AuctionData } from "@/Feauters/auction/domain/entity/AuctionData";
import { UseThemStor } from "@/stor/themStor";

export default function MyAuctionPaidPage() {
  const { mutate, isPending, isError, error } = UseMyAuctionPaid();

  const isDark = UseThemStor((state) => state.isDark);

  const [auctions, setAuctions] = useState<AuctionData[]>([]);

  useEffect(() => {
    mutate(undefined, {
      onSuccess: (data) => {
        setAuctions(data);
      },
    });
  }, [mutate]);

  if (isPending) {
    return (
      <main
        dir="rtl"
        className={`min-h-screen ${
          isDark ? "bg-[#090909]" : "bg-[#f7f8f7]"
        }`}
      >
        <div className="flex min-h-screen items-center justify-center">
          <div
            className={`rounded-2xl px-8 py-6 shadow-sm ${
              isDark
                ? "border border-[#252525] bg-[#141414]"
                : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-5 w-5 animate-spin rounded-full border-2 ${
                  isDark
                    ? "border-[#333333] border-t-[#4E8063]"
                    : "border-gray-200 border-t-[#315C45]"
                }`}
              />
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                جاري تحميل المزادات...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-4 ${
          isDark ? "bg-[#090909]" : "bg-[#f7f8f7]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl p-8 text-center shadow-sm ${
            isDark
              ? "border border-red-900/40 bg-[#141414]"
              : "border border-red-100 bg-white"
          }`}
        >
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
              isDark
                ? "bg-red-500/10 text-red-400"
                : "bg-red-50 text-gray-900"
            }`}
          >
            !
          </div>

          <h2
            className={`mb-2 text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            حدث خطأ
          </h2>

          <p
            className={`text-sm leading-6 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {error instanceof Error
              ? error.message
              : "حدث خطأ أثناء تحميل المزادات"}
          </p>
        </div>
      </main>
    );
  }

  if (auctions.length === 0) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-4 ${
          isDark ? "bg-[#090909]" : "bg-[#f7f8f7]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-3xl p-10 text-center shadow-sm ${
            isDark
              ? "border border-[#252525] bg-[#141414]"
              : "border border-gray-100 bg-white"
          }`}
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#315C45]/10 text-4xl text-[#4E8063]">
            ✓
          </div>

          <h2
            className={`mb-2 text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            لا توجد مزادات مدفوعة
          </h2>

          <p
            className={`text-sm leading-6 ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            لا توجد مزادات انتهت وتم دفع قيمتها حتى الآن.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#090909]" : "bg-[#f7f8f7]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="h-9 w-1 rounded-full bg-[#315C45]" />

              <h1
                className={`text-2xl font-black tracking-tight sm:text-3xl ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                المزادات المدفوعة
              </h1>
            </div>

            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              المزادات التي تم دفع قيمتها من الفائز
            </p>
          </div>

          <div
            className={`w-fit rounded-xl px-4 py-2.5 shadow-sm ${
              isDark
                ? "border border-[#252525] bg-[#141414]"
                : "border border-gray-200 bg-white"
            }`}
          >
            <span
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              عدد المزادات
            </span>

            <span className="mr-2 font-bold text-[#4E8063]">
              {auctions.length}
            </span>
          </div>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => {
            const hasImages =
              auction.images && auction.images.length > 0;

            return (
              <article
                key={auction.id}
                className={`group overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isDark
                    ? "border border-[#252525] bg-[#141414]"
                    : "border border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`relative h-60 overflow-hidden ${
                    isDark ? "bg-[#1b1b1b]" : "bg-gray-100"
                  }`}
                >
                  {hasImages ? (
                    <img
                      src={auction.images![0]}
                      alt={auction.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 text-4xl opacity-40">
                          📷
                        </div>

                        <p
                          className={`text-sm ${
                            isDark
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          لا توجد صورة
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute right-4 top-4">
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg backdrop-blur ${
                        isDark
                          ? "bg-[#141414]/95 text-green-400"
                          : "bg-white/95 text-green-700"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                          isDark
                            ? "bg-green-500/10"
                            : "bg-green-100"
                        }`}
                      >
                        ✓
                      </span>

                      تم الدفع
                    </div>
                  </div>

                  {auction.images &&
                    auction.images.length > 1 && (
                      <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                        {auction.images.length} صور
                      </div>
                    )}

                  <div className="absolute bottom-4 right-4">
                    <p className="text-xs text-white/80">
                      السعر النهائي
                    </p>

                    <p className="text-lg font-black text-white">
                      {auction.current_price}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <h2
                    className={`mb-2 truncate text-lg font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {auction.title}
                  </h2>

                  {auction.description ? (
                    <p
                      className={`mb-5 line-clamp-2 min-h-[48px] text-sm leading-6 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      {auction.description}
                    </p>
                  ) : (
                    <div className="mb-5 h-12" />
                  )}

                  <div
                    className={`mb-5 divide-y rounded-xl border ${
                      isDark
                        ? "divide-[#252525] border-[#252525] bg-[#1b1b1b]"
                        : "divide-gray-100 border-gray-100 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <span
                        className={`text-sm ${
                          isDark
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        حالة المزاد
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          isDark
                            ? "bg-green-500/10 text-green-400"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        مباع
                      </span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3">
                      <span
                        className={`text-sm ${
                          isDark
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        الدفع
                      </span>

                      <span
                        className={`flex items-center gap-1 text-sm font-bold ${
                          isDark
                            ? "text-green-400"
                            : "text-green-600"
                        }`}
                      >
                        <span>✓</span>
                        تم الدفع
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/AuctionDetails/${auction.id}`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-[#315C45] text-sm font-bold text-white transition-all duration-200 hover:bg-[#274b39] hover:shadow-md active:scale-[0.98]"
                  >
                    عرض تفاصيل المزاد
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}