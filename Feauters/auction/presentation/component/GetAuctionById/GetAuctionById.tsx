"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { useGetAuctionById } from "../../hooks/useActionById";
import { useGetBids } from "../../hooks/useGetBids";
import { useFinishAuction } from "../../hooks/useFinishAuction";
import AddBids from "../AddBids/AddBids";
import { UseDeleteAuction } from "../../hooks/useDeleteAuction";
import { UseThemStor } from "@/stor/themStor";

export default function AuctionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const supabase = createClient();

  const {
    mutate,
    data: auction,
    isPending,
    isError,
    error,
  } = useGetAuctionById();

  const {
    data: bids,
    isLoading: bidsLoading,
    isError: bidsError,
  } = useGetBids(auctionId);

  const {
    mutate: finishAuction,
    isPending: isFinishing,
  } = useFinishAuction();

  const {
    mutate: deleteAuction,
    isPending: isDeleting,
  } = UseDeleteAuction();

  const isDark = UseThemStor((state) => state.isDark);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [currentImage, setCurrentImage] = useState(0);
  const [showBid, setShowBid] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUserId(user?.id ?? null);
    };

    getCurrentUser();
  }, [supabase]);

  useEffect(() => {
    if (auctionId) {
      mutate(auctionId);
    }
  }, [auctionId, mutate]);

  if (isPending) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#F4F5F1]"
        }`}
      >
        <div className="text-center">
          <div
            className={`mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-[3px] ${
              isDark
                ? "border-[#26382D] border-t-[#4E8063]"
                : "border-[#D9DDD6] border-t-[#315C45]"
            }`}
          />

          <p
            className={`text-sm font-medium ${
              isDark ? "text-[#91A198]" : "text-[#657067]"
            }`}
          >
            جاري تحميل المزاد...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-5 ${
          isDark ? "bg-[#050706]" : "bg-[#F4F5F1]"
        }`}
      >
        <div
          className={`w-full max-w-md border p-8 text-center shadow-sm ${
            isDark
              ? "border-[#26382D] bg-[#111714]"
              : "border-[#E2DDD5] bg-white"
          }`}
        >
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center text-2xl font-bold ${
              isDark
                ? "bg-[#241819] text-[#D47777]"
                : "bg-[#FCECEC] text-red-500"
            }`}
          >
            !
          </div>

          <h2
            className={`mt-5 text-xl font-bold ${
              isDark ? "text-[#E8EEE9]" : "text-[#27332C]"
            }`}
          >
            حدث خطأ
          </h2>

          <p
            className={`mt-2 text-sm leading-7 ${
              isDark ? "text-[#91A198]" : "text-[#7A827C]"
            }`}
          >
            {error instanceof Error
              ? error.message
              : "حدث خطأ أثناء تحميل المزاد"}
          </p>
        </div>
      </main>
    );
  }

  if (!auction) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#050706]" : "bg-[#F4F5F1]"
        }`}
      >
        <div className="text-center">
          <div
            className={`text-5xl font-black ${
              isDark ? "text-[#34433A]" : "text-[#C9CEC8]"
            }`}
          >
            404
          </div>

          <h2
            className={`mt-4 text-xl font-bold ${
              isDark ? "text-[#E8EEE9]" : "text-[#27332C]"
            }`}
          >
            المزاد غير موجود
          </h2>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-[#91A198]" : "text-[#7A827C]"
            }`}
          >
            لم نتمكن من العثور على هذا المزاد
          </p>
        </div>
      </main>
    );
  }

  const images = auction.images ?? [];

  const currentPrice =
    Number(auction.current_price) || 0;

  const isOwner =
    currentUserId === auction.seller_id;

  const canBid =
    auction.status === "active" && !isOwner;

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "لم يبدأ بعد";
      case "ended":
        return "منتهي";
      case "sold":
        return "مباع";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const statusIsFinished =
    auction.status === "ended" ||
    auction.status === "cancelled" ||
    auction.status === "sold";

  const handleFinishAuction = () => {
    const confirmed = window.confirm(
      "هل أنت متأكد من إنهاء المزاد؟\nسيتم اختيار صاحب أعلى مزايدة كفائز."
    );

    if (!confirmed) {
      return;
    }

    finishAuction(auction.id, {
      onSuccess: () => {
        window.location.reload();
      },
      onError: (error) => {
        window.alert(
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء إنهاء المزاد"
        );
      },
    });
  };

  const handleDeleteAuction = () => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المزاد؟\nلا يمكن التراجع عن عملية الحذف."
    );

    if (!confirmed) {
      return;
    }

    deleteAuction(
      {
        auctionId: auction.id,
      },
      {
        onSuccess: () => {
          router.push("/auction");
        },
        onError: (error) => {
          window.alert(
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء حذف المزاد"
          );
        },
      }
    );
  };

  const getStatusStyle = () => {
    if (
      auction.status === "ended" ||
      auction.status === "sold"
    ) {
      return {
        container: isDark
          ? "border-[#3A2929] bg-[#241819] text-[#D47777]"
          : "border-[#E7CFCF] bg-[#FAEEEE] text-[#9B4A4A]",
        dot: isDark
          ? "bg-[#D47777]"
          : "bg-[#B85C5C]",
      };
    }

    if (auction.status === "cancelled") {
      return {
        container: isDark
          ? "border-[#3A2929] bg-[#241819] text-[#D47777]"
          : "border-[#E7CFCF] bg-[#FAEEEE] text-[#9B4A4A]",
        dot: isDark
          ? "bg-[#D47777]"
          : "bg-[#B85C5C]",
      };
    }

    if (auction.status === "pending") {
      return {
        container: isDark
          ? "border-[#3D3827] bg-[#252216] text-[#C7B875]"
          : "border-[#E5DCC5] bg-[#FAF7ED] text-[#8A7650]",
        dot: isDark
          ? "bg-[#C7B875]"
          : "bg-[#B69A5C]",
      };
    }

    return {
      container: isDark
        ? "border-[#2D4235] bg-[#1B2B22] text-[#6FAF85]"
        : "border-[#C8D8CC] bg-[#EDF4EE] text-[#315C45]",
      dot: isDark
        ? "bg-[#6FAF85]"
        : "bg-[#4E8063]",
    };
  };

  const statusStyle = getStatusStyle();

  const nextImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (images.length === 0) return;

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <main
      dir="rtl"
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-[#050706] text-[#E8EEE9]"
          : "bg-[#F4F5F1] text-[#27332C]"
      }`}
    >
      <header
        className={`border-b ${
          isDark
            ? "border-[#1F2923] bg-[#0B100D]"
            : "border-[#DDE1DB] bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center text-sm font-black text-white ${
                isDark
                  ? "bg-[#315C45]"
                  : "bg-[#315C45]"
              }`}
            >
              M
            </div>

            <div>
              <p
                className={`text-sm font-black tracking-[0.18em] ${
                  isDark
                    ? "text-[#E8EEE9]"
                    : "text-[#27332C]"
                }`}
              >
                MAZAD
              </p>

              <p
                className={`text-[10px] ${
                  isDark
                    ? "text-[#68776E]"
                    : "text-[#8A928C]"
                }`}
              >
                AUCTION PLATFORM
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 text-xs font-medium ${
              isDark
                ? "text-[#91A198]"
                : "text-[#657067]"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#4E8063]" />
            منصة المزادات
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        <div
          className={`mb-8 flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between ${
            isDark
              ? "border-[#1F2923]"
              : "border-[#DDE1DB]"
          }`}
        >
          <div>
            <div
              className={`mb-3 flex items-center gap-2 text-xs font-bold ${
                isDark
                  ? "text-[#6FAF85]"
                  : "text-[#315C45]"
              }`}
            >
              <span>الرئيسية</span>
              <span
                className={
                  isDark
                    ? "text-[#45534B]"
                    : "text-[#A4AAA5]"
                }
              >
                /
              </span>
              <span>المزادات</span>
            </div>

            <h1
              className={`text-3xl font-black tracking-tight sm:text-4xl ${
                isDark
                  ? "text-[#E8EEE9]"
                  : "text-[#27332C]"
              }`}
            >
              {auction.title}
            </h1>

            <p
              className={`mt-2 text-sm ${
                isDark
                  ? "text-[#91A198]"
                  : "text-[#7A827C]"
              }`}
            >
              تفاصيل المنتج وجميع المزايدات الحالية
            </p>
          </div>

          <div
            className={`flex w-fit items-center gap-2 border px-4 py-2.5 text-sm font-bold ${statusStyle.container}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
            />
            {getStatusText(auction.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div
              className={`overflow-hidden border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#DDE1DB] bg-white"
              }`}
            >
              <div
                className={`relative aspect-[16/11] overflow-hidden ${
                  isDark
                    ? "bg-[#151C18]"
                    : "bg-[#E8EBE5]"
                }`}
              >
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[currentImage]}
                      alt={auction.title}
                      className="h-full w-full object-cover transition-all duration-500"
                    />

                    {images.length > 1 && (
                      <div
                        className={`absolute left-5 top-5 px-3 py-2 text-xs font-bold text-white ${
                          isDark
                            ? "bg-[#050706]/90"
                            : "bg-[#27332C]/85"
                        }`}
                      >
                        {currentImage + 1} / {images.length}
                      </div>
                    )}

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={previousImage}
                        aria-label="الصورة السابقة"
                        className={`absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-xl shadow-md transition ${
                          isDark
                            ? "bg-[#111714]/95 text-[#73B88A] hover:bg-[#315C45] hover:text-white"
                            : "bg-white/95 text-[#315C45] hover:bg-[#315C45] hover:text-white"
                        }`}
                      >
                        ›
                      </button>
                    )}

                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={nextImage}
                        aria-label="الصورة التالية"
                        className={`absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-xl shadow-md transition ${
                          isDark
                            ? "bg-[#111714]/95 text-[#73B88A] hover:bg-[#315C45] hover:text-white"
                            : "bg-white/95 text-[#315C45] hover:bg-[#315C45] hover:text-white"
                        }`}
                      >
                        ‹
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <div
                      className={`flex h-16 w-16 items-center justify-center text-xs font-bold ${
                        isDark
                          ? "bg-[#1B2B22] text-[#68776E]"
                          : "bg-white text-[#A4AAA5]"
                      }`}
                    >
                      IMAGE
                    </div>

                    <p
                      className={`mt-4 text-sm ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#8A928C]"
                      }`}
                    >
                      لا توجد صور لهذا المزاد
                    </p>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div
                  className={`border-t p-4 ${
                    isDark
                      ? "border-[#26382D]"
                      : "border-[#E1E4DE]"
                  }`}
                >
                  <div className="flex gap-3 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() =>
                          setCurrentImage(index)
                        }
                        className={`relative h-20 w-24 shrink-0 overflow-hidden border-2 transition ${
                          isDark
                            ? "bg-[#151C18]"
                            : "bg-[#EEF0EC]"
                        } ${
                          currentImage === index
                            ? "border-[#4E8063]"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`صورة المزاد ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`mt-7 border p-6 sm:p-7 ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#DDE1DB] bg-white"
              }`}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-1 bg-[#4E8063]" />

                <h2
                  className={`text-lg font-black ${
                    isDark
                      ? "text-[#E8EEE9]"
                      : "text-[#27332C]"
                  }`}
                >
                  وصف المنتج
                </h2>
              </div>

              <p
                className={`text-sm leading-8 sm:text-base ${
                  isDark
                    ? "text-[#A0ADA5]"
                    : "text-[#69736C]"
                }`}
              >
                {auction.description}
              </p>
            </div>

            <div
              className={`mt-5 border p-6 sm:p-7 ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#DDE1DB] bg-white"
              }`}
            >
              <h2
                className={`mb-5 text-lg font-black ${
                  isDark
                    ? "text-[#E8EEE9]"
                    : "text-[#27332C]"
                }`}
              >
                تفاصيل المزاد
              </h2>

              <div
                className={`divide-y ${
                  isDark
                    ? "divide-[#26382D]"
                    : "divide-[#E8EAE6]"
                }`}
              >
                <div className="flex items-center justify-between py-4">
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-[#8A928C]"
                    }`}
                  >
                    التصنيف
                  </span>

                  <span
                    className={`px-3 py-1.5 text-sm font-bold ${
                      isDark
                        ? "bg-[#1B2B22] text-[#73B88A]"
                        : "bg-[#EDF4EE] text-[#315C45]"
                    }`}
                  >
                    {auction.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-4">
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-[#8A928C]"
                    }`}
                  >
                    الحالة
                  </span>

                  <span
                    className={`flex items-center gap-2 text-sm font-bold ${
                      statusIsFinished
                        ? isDark
                          ? "text-[#D47777]"
                          : "text-[#9B4A4A]"
                        : auction.status === "pending"
                          ? isDark
                            ? "text-[#C7B875]"
                            : "text-[#8A7650]"
                          : isDark
                            ? "text-[#6FAF85]"
                            : "text-[#315C45]"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        statusIsFinished
                          ? isDark
                            ? "bg-[#D47777]"
                            : "bg-[#B85C5C]"
                          : auction.status === "pending"
                            ? isDark
                              ? "bg-[#C7B875]"
                              : "bg-[#B69A5C]"
                            : isDark
                              ? "bg-[#6FAF85]"
                              : "bg-[#4E8063]"
                      }`}
                    />

                    {getStatusText(auction.status)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div
              className={`border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#DDE1DB] bg-white"
              }`}
            >
              <div
                className={`border-b p-6 sm:p-7 ${
                  isDark
                    ? "border-[#26382D]"
                    : "border-[#E5E8E3]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-[#8A928C]"
                    }`}
                  >
                    السعر الابتدائي
                  </span>

                  <span
                    className={`text-sm font-bold ${
                      isDark
                        ? "text-[#B0BBB4]"
                        : "text-[#4A554E]"
                    }`}
                  >
                    {Number(
                      auction.starting_price
                    ).toLocaleString("ar-EG")}{" "}
                    EGP
                  </span>
                </div>

                <div className="mt-7">
                  <p
                    className={`text-sm font-medium ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-[#7A827C]"
                    }`}
                  >
                    السعر الحالي
                  </p>

                  <div className="mt-2 flex items-end gap-3">
                    <span
                      className={`text-4xl font-black tracking-tight sm:text-5xl ${
                        isDark
                          ? "text-[#73B88A]"
                          : "text-[#315C45]"
                      }`}
                    >
                      {currentPrice.toLocaleString(
                        "ar-EG"
                      )}
                    </span>

                    <span
                      className={`pb-1 text-sm font-bold ${
                        isDark
                          ? "text-[#91A198]"
                          : "text-[#7A827C]"
                      }`}
                    >
                      EGP
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {isOwner &&
                auction.status === "active" ? (
                  <>
                    <button
                      type="button"
                      disabled={
                        isFinishing || isDeleting
                      }
                      onClick={
                        handleFinishAuction
                      }
                      className={`flex w-full items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        isDark
                          ? "bg-[#8F4B4B] hover:bg-[#773E3E]"
                          : "bg-[#9B4A4A] hover:bg-[#833C3C]"
                      }`}
                    >
                      <span>
                        {isFinishing
                          ? "جاري إنهاء المزاد..."
                          : "إنهاء المزاد"}
                      </span>

                      {!isFinishing && (
                        <span className="text-lg">
                          ✓
                        </span>
                      )}
                    </button>

                    <p
                      className={`mt-3 text-center text-xs ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#939A95]"
                      }`}
                    >
                      أنت صاحب هذا المزاد
                    </p>

                    <button
                      type="button"
                      disabled={
                        isDeleting || isFinishing
                      }
                      onClick={
                        handleDeleteAuction
                      }
                      className={`mt-3 flex w-full items-center justify-center gap-2 border px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        isDark
                          ? "border-[#3A2929] bg-[#241819] text-[#D47777] hover:bg-[#302020]"
                          : "border-[#E7CFCF] bg-[#FCECEC] text-[#9B4A4A] hover:bg-[#FADEDE]"
                      }`}
                    >
                      {isDeleting
                        ? "جاري حذف المزاد..."
                        : "حذف المزاد"}
                    </button>
                  </>
                ) : isOwner &&
                  auction.status === "sold" ? (
                  <div
                    className={`border px-5 py-5 text-center ${
                      isDark
                        ? "border-[#3A2929] bg-[#241819]"
                        : "border-[#E7CFCF] bg-[#FAEEEE]"
                    }`}
                  >
                    <div
                      className={`mx-auto flex h-10 w-10 items-center justify-center ${
                        isDark
                          ? "bg-[#302020] text-[#D47777]"
                          : "bg-[#FCECEC] text-[#9B4A4A]"
                      }`}
                    >
                      🔒
                    </div>

                    <p
                      className={`mt-3 text-sm font-black ${
                        isDark
                          ? "text-[#D47777]"
                          : "text-[#9B4A4A]"
                      }`}
                    >
                      لا يمكن حذف المزاد بعد بيعه
                    </p>

                    <p
                      className={`mt-1 text-xs leading-6 ${
                        isDark
                          ? "text-[#7D8982]"
                          : "text-[#939A95]"
                      }`}
                    >
                      تم بيع هذا المزاد بنجاح، لذلك لا
                      يمكن حذفه.
                    </p>
                  </div>
                ) : isOwner ? (
                  <>
                    <div
                      className={`border px-5 py-4 text-center ${
                        statusIsFinished
                          ? isDark
                            ? "border-[#3A2929] bg-[#241819]"
                            : "border-[#E7CFCF] bg-[#FAEEEE]"
                          : isDark
                            ? "border-[#3D3827] bg-[#252216]"
                            : "border-[#E5DCC5] bg-[#FAF7ED]"
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          statusIsFinished
                            ? isDark
                              ? "text-[#D47777]"
                              : "text-[#9B4A4A]"
                            : isDark
                              ? "text-[#C7B875]"
                              : "text-[#8A7650]"
                        }`}
                      >
                        {getStatusText(
                          auction.status
                        )}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          isDark
                            ? "text-[#68776E]"
                            : "text-[#939A95]"
                        }`}
                      >
                        أنت صاحب هذا المزاد
                      </p>
                    </div>

                    {auction.status !== "sold" && (
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={
                          handleDeleteAuction
                        }
                        className={`mt-3 flex w-full items-center justify-center border px-6 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isDark
                            ? "border-[#3A2929] bg-[#241819] text-[#D47777] hover:bg-[#302020]"
                            : "border-[#E7CFCF] bg-[#FCECEC] text-[#9B4A4A] hover:bg-[#FADEDE]"
                        }`}
                      >
                        {isDeleting
                          ? "جاري حذف المزاد..."
                          : "حذف المزاد"}
                      </button>
                    )}
                  </>
                ) : canBid ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setShowBid(true)
                      }
                      className={`group flex w-full items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white transition active:scale-[0.99] ${
                        isDark
                          ? "bg-[#315C45] hover:bg-[#264B38]"
                          : "bg-[#315C45] hover:bg-[#264B38]"
                      }`}
                    >
                      <span>
                        تقديم مزايدة
                      </span>

                      <span className="text-lg transition-transform group-hover:-translate-x-1">
                        ←
                      </span>
                    </button>

                    <p
                      className={`mt-3 text-center text-xs ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#939A95]"
                      }`}
                    >
                      يمكنك تقديم مزايدة الآن
                    </p>
                  </>
                ) : (
                  <div
                    className={`border px-5 py-4 text-center ${
                      statusIsFinished
                        ? isDark
                          ? "border-[#3A2929] bg-[#241819]"
                          : "border-[#E7CFCF] bg-[#FAEEEE]"
                        : isDark
                          ? "border-[#3D3827] bg-[#252216]"
                          : "border-[#E5DCC5] bg-[#FAF7ED]"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        statusIsFinished
                          ? isDark
                            ? "text-[#D47777]"
                            : "text-[#9B4A4A]"
                          : isDark
                            ? "text-[#C7B875]"
                            : "text-[#8A7650]"
                      }`}
                    >
                      {getStatusText(
                        auction.status
                      )}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#939A95]"
                      }`}
                    >
                      {statusIsFinished
                        ? "لا يمكن تقديم مزايدة على هذا المزاد"
                        : "لا يمكن تقديم مزايدة الآن"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`mt-5 border p-6 sm:p-7 ${
                isDark
                  ? "border-[#26382D] bg-[#111714]"
                  : "border-[#DDE1DB] bg-white"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2
                    className={`text-lg font-black ${
                      isDark
                        ? "text-[#E8EEE9]"
                        : "text-[#27332C]"
                    }`}
                  >
                    آخر المزايدات
                  </h2>

                  <p
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#68776E]"
                        : "text-[#939A95]"
                    }`}
                  >
                    سجل المزايدات على هذا المزاد
                  </p>
                </div>

                <span
                  className={`flex h-9 min-w-9 items-center justify-center px-2 text-sm font-black ${
                    isDark
                      ? "bg-[#1B2B22] text-[#73B88A]"
                      : "bg-[#EDF4EE] text-[#315C45]"
                  }`}
                >
                  {bids?.length ?? 0}
                </span>
              </div>

              {bidsLoading ? (
                <div className="py-10 text-center">
                  <div
                    className={`mx-auto h-7 w-7 animate-spin rounded-full border-2 ${
                      isDark
                        ? "border-[#26382D] border-t-[#4E8063]"
                        : "border-[#D9DDD6] border-t-[#315C45]"
                    }`}
                  />

                  <p
                    className={`mt-3 text-xs ${
                      isDark
                        ? "text-[#68776E]"
                        : "text-[#8A928C]"
                    }`}
                  >
                    جاري تحميل المزايدات...
                  </p>
                </div>
              ) : bidsError ? (
                <div
                  className={`border px-4 py-6 text-center text-sm ${
                    isDark
                      ? "border-[#3A2929] bg-[#241819] text-[#D47777]"
                      : "border-red-100 bg-red-50 text-red-500"
                  }`}
                >
                  حدث خطأ أثناء تحميل المزايدات
                </div>
              ) : !bids ||
                bids.length === 0 ? (
                <div
                  className={`border border-dashed py-10 text-center ${
                    isDark
                      ? "border-[#26382D] bg-[#151C18]"
                      : "border-[#DDE1DB] bg-[#F7F8F5]"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isDark
                        ? "text-[#A0ADA5]"
                        : "text-[#7A827C]"
                    }`}
                  >
                    لا توجد مزايدات حتى الآن
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#68776E]"
                        : "text-[#9CA39E]"
                    }`}
                  >
                    كن أول من يقدم مزايدة
                  </p>
                </div>
              ) : (
                <div>
                  {bids.map((bid, index) => (
                    <div
                      key={bid.id}
                      className={`relative flex items-center justify-between gap-4 py-5 ${
                        index !== bids.length - 1
                          ? isDark
                            ? "border-b border-[#26382D]"
                            : "border-b border-[#E8EAE6]"
                          : ""
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-black ${
                            isDark
                              ? "bg-[#1B2B22] text-[#73B88A]"
                              : "bg-[#EDF4EE] text-[#315C45]"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <div className="min-w-0">
                          <p
                            className={`truncate text-sm font-bold ${
                              isDark
                                ? "text-[#D8E0DB]"
                                : "text-[#3C4941]"
                            }`}
                          >
                            {bid.bidder_name ??
                              "مستخدم غير معروف"}
                          </p>

                          <p
                            className={`mt-1 truncate text-xs ${
                              isDark
                                ? "text-[#7D8982]"
                                : "text-[#949C96]"
                            }`}
                          >
                            {bid.bidder_phone ??
                              "لا يوجد رقم هاتف"}
                          </p>

                          <p
                            className={`mt-1 text-[11px] ${
                              isDark
                                ? "text-[#65736B]"
                                : "text-[#A5ACA7]"
                            }`}
                          >
                            {new Date(
                              bid.created_at
                            ).toLocaleString(
                              "ar-EG"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-left">
                        <p
                          className={`text-base font-black ${
                            isDark
                              ? "text-[#73B88A]"
                              : "text-[#315C45]"
                          }`}
                        >
                          {Number(
                            bid.amount
                          ).toLocaleString("ar-EG")}
                        </p>

                        <p
                          className={`mt-0.5 text-[10px] font-medium ${
                            isDark
                              ? "text-[#65736B]"
                              : "text-[#9CA39E]"
                          }`}
                        >
                          EGP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div
                className={`border p-4 ${
                  isDark
                    ? "border-[#26382D] bg-[#111714]"
                    : "border-[#DDE1DB] bg-white"
                }`}
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center text-sm font-black ${
                    isDark
                      ? "bg-[#1B2B22] text-[#73B88A]"
                      : "bg-[#EDF4EE] text-[#315C45]"
                  }`}
                >
                  ✓
                </div>

                <p
                  className={`text-xs font-bold ${
                    isDark
                      ? "text-[#D8E0DB]"
                      : "text-[#3C4941]"
                  }`}
                >
                  مزاد موثوق
                </p>

                <p
                  className={`mt-1 text-[11px] leading-5 ${
                    isDark
                      ? "text-[#7D8982]"
                      : "text-[#949C96]"
                  }`}
                >
                  بيانات واضحة وآمنة
                </p>
              </div>

              <div
                className={`border p-4 ${
                  isDark
                    ? "border-[#26382D] bg-[#111714]"
                    : "border-[#DDE1DB] bg-white"
                }`}
              >
                <div
                  className={`mb-3 flex h-9 w-9 items-center justify-center text-sm font-black ${
                    isDark
                      ? "bg-[#1B2B22] text-[#73B88A]"
                      : "bg-[#EDF4EE] text-[#315C45]"
                  }`}
                >
                  $
                </div>

                <p
                  className={`text-xs font-bold ${
                    isDark
                      ? "text-[#D8E0DB]"
                      : "text-[#3C4941]"
                  }`}
                >
                  مزايدة مباشرة
                </p>

                <p
                  className={`mt-1 text-[11px] leading-5 ${
                    isDark
                      ? "text-[#7D8982]"
                      : "text-[#949C96]"
                  }`}
                >
                  شارك بسهولة وسرعة
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer
          className={`mt-10 border-t pt-6 text-center ${
            isDark
              ? "border-[#1F2923]"
              : "border-[#DDE1DB]"
          }`}
        >
          <p
            className={`text-xs font-medium tracking-wide ${
              isDark
                ? "text-[#65736B]"
                : "text-[#9CA39E]"
            }`}
          >
            MAZAD • AUCTION PLATFORM
          </p>
        </footer>
      </div>

      {showBid && canBid && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm ${
            isDark
              ? "bg-black/70"
              : "bg-[#27332C]/45"
          }`}
          onClick={() => setShowBid(false)}
        >
          <div
            className="relative w-full max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() => setShowBid(false)}
              className={`absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center text-lg shadow-md transition ${
                isDark
                  ? "bg-[#151C18] text-[#91A198] hover:bg-red-500 hover:text-white"
                  : "bg-white text-[#657067] hover:bg-red-500 hover:text-white"
              }`}
            >
              ×
            </button>

            <AddBids
              auctionId={auction.id}
              currentPrice={currentPrice}
              onClose={() =>
                setShowBid(false)
              }
            />
          </div>
        </div>
      )}
    </main>
  );
}
