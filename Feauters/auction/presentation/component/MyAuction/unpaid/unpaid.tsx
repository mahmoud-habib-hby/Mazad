"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UseMyAuctionUnPaid } from "../../../hooks/UseMyAuctionUnPaid";
import { AuctionData } from "@/Feauters/auction/domain/entity/AuctionData";
import { UseThemStor } from "@/stor/themStor";

export default function MyAuctionUnPaidPage() {
  const { mutate, isPending, isError, error } = UseMyAuctionUnPaid();

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
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#090909]" : "bg-gray-50"
        }`}
      >
        <div
          className={`rounded-xl px-8 py-6 shadow-sm ${
            isDark
              ? "border border-[#252525] bg-[#141414]"
              : "bg-white"
          }`}
        >
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            جاري تحميل المزادات...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-4 ${
          isDark ? "bg-[#090909]" : "bg-gray-50"
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
            className={`mb-4 text-4xl ${
              isDark ? "text-red-400" : ""
            }`}
          >
            ⚠️
          </div>

          <h2
            className={`mb-2 text-lg font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            حدث خطأ
          </h2>

          <p
            className={`text-sm ${
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
        className={`flex min-h-screen items-center justify-center px-4 ${
          isDark ? "bg-[#090909]" : "bg-gray-50"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl p-10 text-center shadow-sm ${
            isDark
              ? "border border-[#252525] bg-[#141414]"
              : "bg-white"
          }`}
        >
          <div className="mb-4 text-5xl">📦</div>

          <h2
            className={`mb-2 text-xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            لا توجد مزادات
          </h2>

          <p
            className={`text-sm ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            لا توجد مزادات انتهت ولم يتم دفعها حتى الآن
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#090909]" : "bg-gray-50"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[#315C45]" />

            <h1
              className={`text-2xl font-bold sm:text-3xl ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              مزاداتي المنتهية
            </h1>
          </div>

          <p
            className={`text-sm ${
              isDark ? "text-gray-500" : "text-gray-500"
            }`}
          >
            المزادات التي فاز بها المشترون ولم يتم دفع قيمتها
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction) => {
            const hasImages =
              auction.images && auction.images.length > 0;

            const mainImage = hasImages
              ? auction.images![0]
              : null;

            return (
              <div
                key={auction.id}
                className={`group overflow-hidden rounded-2xl shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  isDark
                    ? "border border-[#252525] bg-[#141414]"
                    : "border border-gray-200 bg-white"
                }`}
              >
                <div
                  className={`relative h-56 overflow-hidden ${
                    isDark ? "bg-[#1b1b1b]" : "bg-gray-100"
                  }`}
                >
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={auction.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 text-4xl">
                          📷
                        </div>

                        <span
                          className={`text-sm ${
                            isDark
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          لا توجد صور
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                        isDark
                          ? "bg-red-500/10 text-red-400"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      لم يتم الدفع
                    </span>
                  </div>

                  {auction.images &&
                    auction.images.length > 1 && (
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        {auction.images.length} صور
                      </div>
                    )}
                </div>

                <div className="p-5">
                  <h2
                    className={`mb-2 truncate text-lg font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {auction.title}
                  </h2>

                  {auction.description && (
                    <p
                      className={`mb-5 line-clamp-2 min-h-10 text-sm leading-5 ${
                        isDark
                          ? "text-gray-500"
                          : "text-gray-500"
                      }`}
                    >
                      {auction.description}
                    </p>
                  )}

                  <div
                    className={`mb-5 rounded-xl p-4 ${
                      isDark
                        ? "border border-[#252525] bg-[#1b1b1b]"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          isDark
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        السعر النهائي
                      </span>

                      <span className="text-lg font-bold text-[#4E8063]">
                        {auction.current_price}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/AuctionDetails/${auction.id}`}
                    className="flex w-full items-center justify-center rounded-xl bg-[#315C45] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#264936] active:scale-[0.98]"
                  >
                    عرض تفاصيل المزاد
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}