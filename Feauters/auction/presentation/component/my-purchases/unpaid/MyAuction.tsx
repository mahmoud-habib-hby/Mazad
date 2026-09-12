"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { AuctionData } from "@/Feauters/auction/domain/entity/AuctionData";
import { useMyAuctions } from "../../../hooks/useMyAuction";
import { UseThemStor } from "@/stor/themStor";

export default function MyAuctionsPage() {
  const router = useRouter();
  const supabase = createClient();

  const {
    mutate,
    data: auctions,
    isPending,
    isError,
    error,
  } = useMyAuctions();

  const isDark = UseThemStor((state) => state.isDark);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      mutate(user.id);
    };

    getUser();
  }, [mutate, router, supabase]);

  if (isPending) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#FCFAF5]"
        }`}
      >
        <p
          className={`${
            isDark ? "text-[#91A198]" : "text-[#737A70]"
          }`}
        >
          جاري تحميل المزادات التي فزت بها...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#FCFAF5]"
        }`}
      >
        <p
          className={`${
            isDark ? "text-red-400" : "text-red-600"
          }`}
        >
          {error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل المزادات"}
        </p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${
        isDark
          ? "bg-[#050706] text-[#E8EEE9]"
          : "bg-[#FCFAF5] text-[#2F342F]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-[#E8EEE9]" : "text-[#2F342F]"
            }`}
          >
            المزادات التي فزت بها
          </h1>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#91A198]" : "text-[#737A70]"
            }`}
          >
            المزادات التي فزت بها ويمكنك إتمام عملية الشراء
          </p>
        </div>

        {!auctions || auctions.length === 0 ? (
          <div
            className={`rounded-2xl border p-10 text-center shadow-sm ${
              isDark
                ? "border-[#26382D] bg-[#111714]"
                : "border-[#E8E3D9] bg-white"
            }`}
          >
            <p
              className={`${
                isDark ? "text-[#91A198]" : "text-[#737A70]"
              }`}
            >
              لم تفز بأي مزاد حتى الآن
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {auctions.map((auction: AuctionData) => (
              <div
                key={auction.id}
                onClick={() =>
                  router.push(`/CheckOut/${auction.id}`)
                }
                className={`cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md ${
                  isDark
                    ? "border-[#26382D] bg-[#111714] hover:border-[#315C45]"
                    : "border-[#E8E3D9] bg-white"
                }`}
              >
                {auction.images?.length > 0 ? (
                  <img
                    src={auction.images[0]}
                    alt={auction.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-56 w-full items-center justify-center ${
                      isDark
                        ? "bg-[#151C18]"
                        : "bg-[#F8F6F0]"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#737A70]"
                      }`}
                    >
                      لا توجد صورة
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <h2
                    className={`mb-3 text-xl font-bold ${
                      isDark
                        ? "text-[#E8EEE9]"
                        : "text-[#2F342F]"
                    }`}
                  >
                    {auction.title}
                  </h2>

                  <p
                    className={`mb-5 line-clamp-2 text-sm leading-6 ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-[#737A70]"
                    }`}
                  >
                    {auction.description}
                  </p>

                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark
                          ? "text-[#91A198]"
                          : "text-[#737A70]"
                      }`}
                    >
                      السعر النهائي
                    </span>

                    <span
                      className={`font-bold ${
                        isDark
                          ? "text-[#73B88A]"
                          : "text-[#4F6F52]"
                      }`}
                    >
                      {Number(
                        auction.current_price
                      ).toLocaleString()}{" "}
                      جنيه
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isDark
                          ? "text-[#91A198]"
                          : "text-[#737A70]"
                      }`}
                    >
                      الحالة
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isDark
                          ? "bg-[#1B2B22] text-[#73B88A]"
                          : "bg-[#EAF0E7] text-[#4F6F52]"
                      }`}
                    >
                      فائز
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}