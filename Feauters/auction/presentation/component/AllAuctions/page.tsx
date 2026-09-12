"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { useAllAuctions } from "../../hooks/UseAllAuction";

import { AuctionData } from "@/Feauters/auction/domain/entity/AuctionData";

import { UseThemStor } from "@/stor/themStor";

type FilterType = "all" | "mine" | "others";

type StatusFilter =
  | "all"
  | "active"
  | "pending"
  | "ended"
  | "sold"
  | "cancelled";

export default function AllAuctionsPage() {
  const router = useRouter();

  const {
    mutate,
    data: auctions,
    isPending,
    isError,
    error,
  } = useAllAuctions();

  const isDark = UseThemStor((state) => state.isDark);

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [categoryFilter, setCategoryFilter] =
    useState<string>("all");

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id ?? null);
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    mutate();
  }, [mutate]);

  const displayedAuctions = (
    auctions ?? []
  ).filter((auction) => {
    const matchesUser =
      filter === "all"
        ? true
        : filter === "mine"
          ? auction.seller_id === currentUserId
          : auction.seller_id !== currentUserId;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : auction.status === statusFilter;

    const matchesCategory =
      categoryFilter === "all"
        ? true
        : auction.category === categoryFilter;

    return (
      matchesUser &&
      matchesStatus &&
      matchesCategory
    );
  });

  if (isPending) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center transition-colors duration-300 ${
          isDark
            ? "bg-[#050706] text-[#E8EEE9]"
            : "bg-[#F5F3EE]"
        }`}
      >
        <p
          className={`text-sm font-semibold ${
            isDark
              ? "text-[#73B88A]"
              : "text-[#315C45]"
          }`}
        >
          جاري تحميل المزادات...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-5 transition-colors duration-300 ${
          isDark
            ? "bg-[#050706] text-[#E8EEE9]"
            : "bg-[#F5F3EE]"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl border p-8 text-center shadow-sm ${
            isDark
              ? "border-[#4A2929] bg-[#111714]"
              : "border-red-200 bg-white"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDark
                ? "text-[#E58B8B]"
                : "text-red-600"
            }`}
          >
            حدث خطأ
          </h2>

          <p
            className={`mt-2 text-sm ${
              isDark
                ? "text-[#91A198]"
                : "text-gray-500"
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

  return (
    <main
      dir="rtl"
      className={`min-h-screen px-4 py-8 transition-colors duration-300 ${
        isDark
          ? "bg-[#050706] text-[#E8EEE9]"
          : "bg-[#F5F3EE] text-[#222]"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p
                className={`mb-2 text-xs font-bold tracking-widest ${
                  isDark
                    ? "text-[#73B88A]"
                    : "text-[#315C45]"
                }`}
              >
                MAZAD
              </p>

              <h1
                className={`text-3xl font-black tracking-tight sm:text-4xl ${
                  isDark
                    ? "text-[#E8EEE9]"
                    : "text-[#1F2923]"
                }`}
              >
                المزادات
              </h1>

              <p
                className={`mt-2 text-sm ${
                  isDark
                    ? "text-[#91A198]"
                    : "text-gray-500"
                }`}
              >
                تصفح المزادات واختر ما يناسبك
              </p>
            </div>

            <div
              className={`rounded-xl border px-5 py-3 shadow-sm ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#E3E0D8] bg-white"
              }`}
            >
              <p
                className={`text-xs ${
                  isDark
                    ? "text-[#68776E]"
                    : "text-gray-500"
                }`}
              >
                عدد المزادات
              </p>

              <p
                className={`mt-1 text-xl font-black ${
                  isDark
                    ? "text-[#73B88A]"
                    : "text-[#315C45]"
                }`}
              >
                {displayedAuctions.length}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            <FilterBox
              title="نوع المزاد"
              isDark={isDark}
            >
              <FilterButton
                active={filter === "all"}
                onClick={() => setFilter("all")}
                isDark={isDark}
              >
                الكل
              </FilterButton>

              <FilterButton
                active={filter === "mine"}
                onClick={() => setFilter("mine")}
                isDark={isDark}
              >
                مزاداتي
              </FilterButton>

              <FilterButton
                active={filter === "others"}
                onClick={() => setFilter("others")}
                isDark={isDark}
              >
                الآخرين
              </FilterButton>
            </FilterBox>

            <FilterBox
              title="حالة المزاد"
              isDark={isDark}
            >
              <FilterButton
                active={statusFilter === "all"}
                onClick={() => setStatusFilter("all")}
                isDark={isDark}
              >
                الكل
              </FilterButton>

              <FilterButton
                active={statusFilter === "active"}
                onClick={() => setStatusFilter("active")}
                isDark={isDark}
              >
                النشطة
              </FilterButton>

              <FilterButton
                active={statusFilter === "pending"}
                onClick={() => setStatusFilter("pending")}
                isDark={isDark}
              >
                لم تبدأ
              </FilterButton>

              <FilterButton
                active={statusFilter === "ended"}
                onClick={() => setStatusFilter("ended")}
                isDark={isDark}
              >
                المنتهية
              </FilterButton>

              <FilterButton
                active={statusFilter === "sold"}
                onClick={() => setStatusFilter("sold")}
                isDark={isDark}
              >
                المباعة
              </FilterButton>

              <FilterButton
                active={statusFilter === "cancelled"}
                onClick={() => setStatusFilter("cancelled")}
                isDark={isDark}
              >
                الملغاة
              </FilterButton>
            </FilterBox>

            <FilterBox
              title="التصنيف"
              isDark={isDark}
            >
              <FilterButton
                active={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
                isDark={isDark}
              >
                الكل
              </FilterButton>

              <FilterButton
                active={categoryFilter === "cars"}
                onClick={() => setCategoryFilter("cars")}
                isDark={isDark}
              >
                سيارات
              </FilterButton>

              <FilterButton
                active={categoryFilter === "real_estate"}
                onClick={() =>
                  setCategoryFilter("real_estate")
                }
                isDark={isDark}
              >
                عقارات
              </FilterButton>

              <FilterButton
                active={categoryFilter === "furniture"}
                onClick={() =>
                  setCategoryFilter("furniture")
                }
                isDark={isDark}
              >
                أثاث
              </FilterButton>
            </FilterBox>
          </div>
        </header>

        {displayedAuctions.length === 0 ? (
          <div
            className={`rounded-2xl border py-20 text-center shadow-sm ${
              isDark
                ? "border-[#26382D] bg-[#111714]"
                : "border-[#E3E0D8] bg-white"
            }`}
          >
            <h2
              className={`text-lg font-bold ${
                isDark
                  ? "text-[#91A198]"
                  : "text-gray-500"
              }`}
            >
              لا توجد مزادات
            </h2>

            <p
              className={`mt-2 text-sm ${
                isDark
                  ? "text-[#68776E]"
                  : "text-gray-400"
              }`}
            >
              لا توجد مزادات مطابقة للفلاتر الحالية
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                currentUserId={currentUserId}
                isDark={isDark}
                onView={() =>
                  router.push(
                    `/AuctionDetails/${auction.id}`
                  )
                }
                onEdit={() =>
                  router.push(
                    `/UpdateAuction/${auction.id}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function FilterBox({
  title,
  children,
  isDark,
}: {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 shadow-sm ${
        isDark
          ? "border-[#26382D] bg-[#111714]"
          : "border-[#E3E0D8] bg-white"
      }`}
    >
      <p
        className={`mb-2 px-1 text-xs font-bold ${
          isDark
            ? "text-[#91A198]"
            : "text-gray-500"
        }`}
      >
        {title}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {children}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
  isDark,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  isDark: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
        active
          ? isDark
            ? "bg-[#315C45] text-white"
            : "bg-[#315C45] text-white"
          : isDark
            ? "text-[#91A198] hover:bg-[#1B2B22] hover:text-[#73B88A]"
            : "text-gray-500 hover:bg-[#F5F3EE] hover:text-[#315C45]"
      }`}
    >
      {children}
    </button>
  );
}

function AuctionCard({
  auction,
  currentUserId,
  isDark,
  onView,
  onEdit,
}: {
  auction: AuctionData;
  currentUserId: string | null;
  isDark: boolean;
  onView: () => void;
  onEdit: () => void;
}) {
  const [currentImage, setCurrentImage] =
    useState(0);

  const images = auction.images ?? [];

  const isOwner =
    auction.seller_id === currentUserId;

  const nextImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  };

  const previousImage = () => {
    if (images.length <= 1) return;

    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  const statusText =
    auction.status === "ended"
      ? "منتهي"
      : auction.status === "sold"
        ? "مباع"
        : auction.status === "active"
          ? "نشط"
          : auction.status === "pending"
            ? "لم يبدأ"
            : "ملغي";

  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${
        isDark
          ? "border-[#26382D] bg-[#111714]"
          : "border-[#E3E0D8] bg-white"
      }`}
    >
      <div
        className={`relative h-60 overflow-hidden ${
          isDark
            ? "bg-[#151C18]"
            : "bg-[#ECEAE4]"
        }`}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage]}
              alt={auction.title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            <span
              className={`absolute right-4 top-4 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${
                isDark
                  ? "bg-[#111714]/90 text-[#73B88A]"
                  : "bg-white/90 text-[#315C45]"
              }`}
            >
              {statusText}
            </span>

            <span className="absolute left-4 top-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
              {auction.category}
            </span>

            {images.length > 1 && (
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                {currentImage + 1}/{images.length}
              </span>
            )}

            {images.length > 1 && (
              <button
                type="button"
                onClick={previousImage}
                className={`absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-sm transition ${
                  isDark
                    ? "bg-[#111714]/90 text-[#73B88A] hover:bg-[#315C45] hover:text-white"
                    : "bg-white/90 text-lg text-[#315C45] hover:bg-[#315C45] hover:text-white"
                }`}
              >
                ‹
              </button>
            )}

            {images.length > 1 && (
              <button
                type="button"
                onClick={nextImage}
                className={`absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-sm transition ${
                  isDark
                    ? "bg-[#111714]/90 text-[#73B88A] hover:bg-[#315C45] hover:text-white"
                    : "bg-white/90 text-lg text-[#315C45] hover:bg-[#315C45] hover:text-white"
                }`}
              >
                ›
              </button>
            )}

            <h2 className="absolute bottom-4 left-4 right-4 truncate text-xl font-black text-white">
              {auction.title}
            </h2>
          </>
        ) : (
          <div
            className={`flex h-full items-center justify-center text-sm ${
              isDark
                ? "text-[#68776E]"
                : "text-gray-400"
            }`}
          >
            لا توجد صورة
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          {isOwner ? (
            <span
              className={`rounded-lg px-3 py-1 text-[10px] font-bold ${
                isDark
                  ? "bg-[#1B2B22] text-[#73B88A]"
                  : "bg-[#E8F0EB] text-[#315C45]"
              }`}
            >
              مزادي
            </span>
          ) : (
            <span
              className={`rounded-lg px-3 py-1 text-[10px] font-bold ${
                isDark
                  ? "bg-[#1B1F1C] text-[#91A198]"
                  : "bg-[#F2F1ED] text-gray-500"
              }`}
            >
              مزاد آخر
            </span>
          )}
        </div>

        <p
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark
              ? "text-[#73B88A]"
              : "text-[#315C45]"
          }`}
        >
          {auction.category}
        </p>

        <h2
          className={`mt-2 truncate text-xl font-black ${
            isDark
              ? "text-[#E8EEE9]"
              : "text-[#202820]"
          }`}
        >
          {auction.title}
        </h2>

        <p
          className={`mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 ${
            isDark
              ? "text-[#91A198]"
              : "text-gray-500"
          }`}
        >
          {auction.description}
        </p>

        <div
          className={`mt-5 flex items-end justify-between rounded-xl border p-4 ${
            isDark
              ? "border-[#26382D] bg-[#151C18]"
              : "border-[#E8E5DE] bg-[#F8F7F3]"
          }`}
        >
          <div>
            <p
              className={`text-[10px] ${
                isDark
                  ? "text-[#68776E]"
                  : "text-gray-400"
              }`}
            >
              السعر الحالي
            </p>

            <p
              className={`mt-1 text-xl font-black ${
                isDark
                  ? "text-[#73B88A]"
                  : "text-[#315C45]"
              }`}
            >
              {auction.current_price}
            </p>
          </div>

          <div className="text-left">
            <p
              className={`text-[10px] ${
                isDark
                  ? "text-[#68776E]"
                  : "text-gray-400"
              }`}
            >
              سعر البداية
            </p>

            <p
              className={`mt-1 text-sm font-bold ${
                isDark
                  ? "text-[#B8C4BD]"
                  : "text-gray-600"
              }`}
            >
              {auction.starting_price}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onView}
            className="flex-1 rounded-xl bg-[#315C45] py-3 text-sm font-black text-white transition hover:bg-[#264B38]"
          >
            عرض المزاد
          </button>

          {isOwner && auction.status !== "sold" && (
            <button
              type="button"
              onClick={onEdit}
              className={`flex-1 rounded-xl border py-3 text-sm font-bold transition ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#B8C4BD] hover:border-[#4E8063] hover:text-[#73B88A]"
                  : "border-[#DDDAD2] bg-white text-gray-600 hover:border-[#315C45] hover:text-[#315C45]"
              }`}
            >
              تعديل
            </button>
          )}
        </div>

        {isOwner && auction.status === "sold" && (
          <div
            className={`mt-3 rounded-xl border px-4 py-3 text-center ${
              isDark
                ? "border-[#26382D] bg-[#151C18]"
                : "border-[#E3E0D8] bg-[#F8F7F3]"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                isDark
                  ? "text-[#91A198]"
                  : "text-gray-500"
              }`}
            >
              المزاد مباع لا يمكن التعديل
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
