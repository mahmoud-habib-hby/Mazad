"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useGetAuctionById } from "../../hooks/useActionById";
import { useUpdateAuction } from "../../hooks/UseUpdateAuction";
import { useUploadImage } from "../../hooks/UseUploadImage";
import { useSaveImage } from "../../hooks/useSaveImage";
import { UseRermoveImage } from "../../hooks/useRemoveImage";

import { AuctionData } from "@/Feauters/auction/domain/entity/AuctionData";
import { UpdateAuctionData } from "@/Feauters/auction/domain/entity/UpdateAuctionData";
import { AuctionCategory } from "@/Feauters/auction/domain/entity/CategoryData";
import { UseThemStor } from "@/stor/themStor";


export default function UpdateAuction() {
  const router = useRouter();
  const params = useParams();
  const auctionId = params.id as string;

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isDark =UseThemStor((state) => state.isDark);

  const getAuctionById = useGetAuctionById();
  const updateAuction = useUpdateAuction();
  const uploadImage = useUploadImage();
  const saveImage = useSaveImage();
  const removeImage = UseRermoveImage();

  const [auction, setAuction] =
    useState<AuctionData | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!auctionId) return;

    getAuctionById.mutate(auctionId, {
      onSuccess: (data) => {
        setAuction(data);
      },
      onError: (error) => {
        console.error("GET AUCTION ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "فشل تحميل المزاد"
        );
      },
    });
  }, [auctionId]);

  if (getAuctionById.isPending && !auction) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center ${
          isDark ? "bg-[#0B0F0D]" : "bg-[#F4F5F1]"
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

  if (!auction) {
    return (
      <main
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-5 ${
          isDark ? "bg-[#0B0F0D]" : "bg-[#F4F5F1]"
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
                : "bg-[#FCECEC] text-[#B85C5C]"
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
            {error || "المزاد غير موجود"}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className={`mt-6 border px-6 py-3 text-sm font-bold transition ${
              isDark
                ? "border-[#2D4235] bg-[#162019] text-[#6FAF85] hover:bg-[#1B2B22]"
                : "border-[#DDE1DB] bg-white text-[#315C45] hover:bg-[#EDF4EE]"
            }`}
          >
            رجوع
          </button>
        </div>
      </main>
    );
  }

  if (auction.status === "sold") {
    return (
      <main
        dir="rtl"
        className={`min-h-screen ${
          isDark
            ? "bg-[#0B0F0D] text-[#E8EEE9]"
            : "bg-[#F4F5F1] text-[#27332C]"
        }`}
      >
        <header
          className={`border-b ${
            isDark
              ? "border-[#26382D] bg-[#0F1411]"
              : "border-[#DDE1DB] bg-white"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center bg-[#315C45] text-sm font-black text-white">
                M
              </div>

              <div>
                <p
                  className={`text-sm font-black tracking-[0.18em] ${
                    isDark ? "text-[#E8EEE9]" : "text-[#27332C]"
                  }`}
                >
                  MAZAD
                </p>

                <p className="text-[10px] text-[#8A928C]">
                  AUCTION PLATFORM
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-2 text-xs font-medium ${
                isDark ? "text-[#91A198]" : "text-[#657067]"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-[#4E8063]" />
              منصة المزادات
            </div>
          </div>
        </header>

        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-5 py-10">
          <div
            className={`w-full border p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${
              isDark
                ? "border-[#3A2929] bg-[#111714]"
                : "border-[#E7CFCF] bg-white"
            }`}
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center text-2xl ${
                isDark
                  ? "bg-[#241819] text-[#D47777]"
                  : "bg-[#FAEEEE] text-[#9B4A4A]"
              }`}
            >
              🔒
            </div>

            <h1
              className={`mt-6 text-2xl font-black ${
                isDark ? "text-[#E8EEE9]" : "text-[#27332C]"
              }`}
            >
              لا يمكن تعديل المزاد
            </h1>

            <p
              className={`mt-3 text-sm leading-7 ${
                isDark ? "text-[#91A198]" : "text-[#7A827C]"
              }`}
            >
              هذا المزاد تم بيعه بالفعل، لذلك لا يمكن تعديل بياناته.
            </p>

            <div
              className={`mt-6 border px-5 py-4 ${
                isDark
                  ? "border-[#3A2929] bg-[#241819]"
                  : "border-[#E7CFCF] bg-[#FAEEEE]"
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  isDark ? "text-[#D47777]" : "text-[#9B4A4A]"
                }`}
              >
                المزاد مباع
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(`/auction/${auction.id}`)
              }
              className="mt-6 w-full bg-[#315C45] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#264B38]"
            >
              العودة إلى المزاد
            </button>
          </div>
        </div>
      </main>
    );
  }

  const updateField = <
    K extends keyof AuctionData
  >(
    field: K,
    value: AuctionData[K]
  ) => {
    setAuction((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    setError("");

    try {
      for (const file of files) {
        const imageUrl =
          await uploadImage.mutateAsync({
            id: auction.id,
            image: file,
          });

        await saveImage.mutateAsync({
          id: auction.id,
          url: imageUrl,
        });

        setAuction((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            images: [
              ...(prev.images ?? []),
              imageUrl,
            ],
          };
        });
      }
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "فشل رفع الصورة"
      );
    }

    e.target.value = "";
  };

  const handleRemoveImage = async (
    imageUrl: string
  ) => {
    setError("");

    try {
      await removeImage.mutateAsync({
        id: auction.id,
        url: imageUrl,
      });

      setAuction((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          images: (prev.images ?? []).filter(
            (image) => image !== imageUrl
          ),
        };
      });
    } catch (error) {
      console.error("REMOVE IMAGE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "فشل حذف الصورة"
      );
    }
  };

  const handleSubmit = () => {
    setError("");

    const data: UpdateAuctionData = {
      id: auction.id,
      title: auction.title,
      description: auction.description,
      category: auction.category as AuctionCategory,
      starting_price: Number(auction.starting_price),
      status: auction.status,
      images: auction.images ?? [],
    };

    updateAuction.mutate(data, {
      onSuccess: () => {
        router.push("/auctions");
      },

      onError: (error) => {
        console.error("UPDATE AUCTION ERROR:", error);

        setError(
          error instanceof Error
            ? error.message
            : "فشل تحديث المزاد"
        );
      },
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "لم يبدأ";
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

  const getStatusStyle = () => {
    if (
      auction.status === "ended" ||
      auction.status === "cancelled"
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
        ? "border-[#294635] bg-[#142119] text-[#73B88A]"
        : "border-[#C8D8CC] bg-[#EDF4EE] text-[#315C45]",
      dot: isDark
        ? "bg-[#73B88A]"
        : "bg-[#4E8063]",
    };
  };

  const statusStyle = getStatusStyle();

  const cardClass = isDark
    ? "border-[#26382D] bg-[#111714]"
    : "border-[#DDE1DB] bg-white";

  const cardHeaderClass = isDark
    ? "border-[#26382D]"
    : "border-[#E5E8E3]";

  const headingClass = isDark
    ? "text-[#E8EEE9]"
    : "text-[#27332C]";

  const mutedClass = isDark
    ? "text-[#91A198]"
    : "text-[#7A827C]";

  const labelClass = isDark
    ? "text-[#A8B5AD]"
    : "text-[#657067]";

  const inputClass = isDark
    ? "border-[#2B4033] bg-[#18211C] text-[#E8EEE9] placeholder:text-[#657067] focus:border-[#4E8063] focus:bg-[#1B2720]"
    : "border-[#DDE1DB] bg-[#F7F8F5] text-[#27332C] focus:border-[#315C45] focus:bg-white";

  return (
    <main
      dir="rtl"
      className={`min-h-screen ${
        isDark
          ? "bg-[#0B0F0D] text-[#E8EEE9]"
          : "bg-[#F4F5F1] text-[#27332C]"
      }`}
    >
      <header
        className={`border-b ${
          isDark
            ? "border-[#26382D] bg-[#0F1411]"
            : "border-[#DDE1DB] bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-[#315C45] text-sm font-black text-white">
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

              <p className="text-[10px] text-[#8A928C]">
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
              ? "border-[#26382D]"
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
                    ? "text-[#53635A]"
                    : "text-[#A4AAA5]"
                }
              >
                /
              </span>
              <span>المزادات</span>
              <span
                className={
                  isDark
                    ? "text-[#53635A]"
                    : "text-[#A4AAA5]"
                }
              >
                /
              </span>
              <span>تعديل المزاد</span>
            </div>

            <h1
              className={`text-3xl font-black tracking-tight sm:text-4xl ${headingClass}`}
            >
              تعديل المزاد
            </h1>

            <p className={`mt-2 text-sm ${mutedClass}`}>
              تعديل بيانات المزاد والصور الخاصة به
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

        {error && (
          <div
            className={`mb-7 border px-5 py-4 text-sm font-medium ${
              isDark
                ? "border-[#3A2929] bg-[#241819] text-[#D47777]"
                : "border-[#E7CFCF] bg-[#FAEEEE] text-[#9B4A4A]"
            }`}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div
              className={`border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${cardClass}`}
            >
              <div
                className={`border-b p-6 sm:p-7 ${cardHeaderClass}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className={`text-lg font-black ${headingClass}`}
                    >
                      صور المزاد
                    </h2>

                    <p className={`mt-1 text-xs ${mutedClass}`}>
                      أضف أو احذف صور المنتج
                    </p>
                  </div>

                  <span
                    className={`flex h-9 min-w-9 items-center justify-center px-3 text-sm font-black ${
                      isDark
                        ? "bg-[#183023] text-[#73B88A]"
                        : "bg-[#EDF4EE] text-[#315C45]"
                    }`}
                  >
                    {auction.images?.length ?? 0}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-7">
                <button
                  type="button"
                  disabled={
                    uploadImage.isPending ||
                    saveImage.isPending ||
                    removeImage.isPending
                  }
                  onClick={() => inputRef.current?.click()}
                  className={`mb-5 flex w-full items-center justify-center border border-dashed px-5 py-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isDark
                      ? "border-[#3A5746] bg-[#141D18] text-[#73B88A] hover:border-[#5B9A70] hover:bg-[#19271F]"
                      : "border-[#BFC9C1] bg-[#F7F8F5] text-[#315C45] hover:border-[#315C45] hover:bg-[#EDF4EE]"
                  }`}
                >
                  {uploadImage.isPending ||
                  saveImage.isPending
                    ? "جاري رفع الصور..."
                    : "+ إضافة صور"}
                </button>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />

                {(auction.images?.length ?? 0) > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {auction.images.map(
                      (image, index) => (
                        <div
                          key={image}
                          className={`group relative aspect-square overflow-hidden border ${
                            isDark
                              ? "border-[#2B4033] bg-[#18211C]"
                              : "border-[#DDE1DB] bg-[#E8EBE5]"
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`صورة المزاد ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            className="object-cover transition duration-300 group-hover:scale-105"
                          />

                          <button
                            type="button"
                            disabled={removeImage.isPending}
                            onClick={() =>
                              handleRemoveImage(image)
                            }
                            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-[#9B4A4A] text-lg font-bold text-white shadow-md transition hover:bg-[#833C3C] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="حذف الصورة"
                          >
                            ×
                          </button>

                          <div className="absolute bottom-3 left-3 bg-[#101512]/85 px-2.5 py-1.5 text-[10px] font-bold text-white">
                            {index + 1}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className={`border border-dashed py-14 text-center ${
                      isDark
                        ? "border-[#2B4033] bg-[#141B17]"
                        : "border-[#DDE1DB] bg-[#F7F8F5]"
                    }`}
                  >
                    <div
                      className={`mx-auto flex h-14 w-14 items-center justify-center text-xs font-black ${
                        isDark
                          ? "bg-[#1B2720] text-[#68776E]"
                          : "bg-white text-[#A4AAA5]"
                      }`}
                    >
                      IMAGE
                    </div>

                    <p
                      className={`mt-4 text-sm font-medium ${mutedClass}`}
                    >
                      لا توجد صور لهذا المزاد
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        isDark
                          ? "text-[#68776E]"
                          : "text-[#9CA39E]"
                      }`}
                    >
                      يمكنك إضافة صور من الزر بالأعلى
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`mt-5 border p-6 sm:p-7 ${cardClass}`}
            >
              <h2
                className={`mb-4 text-lg font-black ${headingClass}`}
              >
                معلومات المزاد
              </h2>

              <div
                className={`border px-4 py-4 ${
                  isDark
                    ? "border-[#2B4033] bg-[#141B17]"
                    : "border-[#E8EAE6] bg-[#F7F8F5]"
                }`}
              >
                <p
                  className={`text-xs ${
                    isDark
                      ? "text-[#718078]"
                      : "text-[#939A95]"
                  }`}
                >
                  معرف المزاد
                </p>

                <p
                  className={`mt-2 break-all text-xs font-bold ${
                    isDark
                      ? "text-[#A8B5AD]"
                      : "text-[#657067]"
                  }`}
                >
                  {auction.id}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div
              className={`border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${cardClass}`}
            >
              <div
                className={`border-b p-6 sm:p-7 ${cardHeaderClass}`}
              >
                <h2
                  className={`text-lg font-black ${headingClass}`}
                >
                  بيانات المزاد
                </h2>

                <p className={`mt-1 text-xs ${mutedClass}`}>
                  قم بتعديل البيانات الأساسية
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div>
                  <label
                    className={`mb-2 block text-sm font-bold ${labelClass}`}
                  >
                    عنوان المزاد
                  </label>

                  <input
                    type="text"
                    value={auction.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    className={`w-full border px-4 py-3 text-sm outline-none transition ${inputClass}`}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-bold ${labelClass}`}
                  >
                    الوصف
                  </label>

                  <textarea
                    value={auction.description ?? ""}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    rows={6}
                    className={`w-full resize-none border px-4 py-3 text-sm leading-7 outline-none transition ${inputClass}`}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-bold ${labelClass}`}
                  >
                    التصنيف
                  </label>

                  <select
                    value={auction.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value as AuctionCategory
                      )
                    }
                    className={`w-full border px-4 py-3 text-sm outline-none transition ${inputClass}`}
                  >
                    <option value="cars">سيارات</option>
                    <option value="real_estate">
                      عقارات
                    </option>
                    <option value="furniture">
                      أثاث
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div
              className={`mt-5 border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${cardClass}`}
            >
              <div
                className={`border-b p-6 sm:p-7 ${cardHeaderClass}`}
              >
                <h2
                  className={`text-lg font-black ${headingClass}`}
                >
                  الأسعار
                </h2>

                <p className={`mt-1 text-xs ${mutedClass}`}>
                  إدارة سعر المزاد
                </p>
              </div>

              <div className="space-y-5 p-6 sm:p-7">
                <div>
                  <label
                    className={`mb-2 block text-sm font-bold ${labelClass}`}
                  >
                    السعر الابتدائي
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={auction.starting_price}
                      onChange={(e) =>
                        updateField(
                          "starting_price",
                          Number(e.target.value)
                        )
                      }
                      className={`w-full border px-4 py-3 pl-16 text-sm outline-none transition ${inputClass}`}
                    />

                    <span
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        isDark
                          ? "text-[#718078]"
                          : "text-[#8A928C]"
                      }`}
                    >
                      EGP
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-bold ${labelClass}`}
                  >
                    السعر الحالي
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      value={auction.current_price}
                      disabled
                      className={`w-full border px-4 py-3 pl-16 text-sm outline-none ${
                        isDark
                          ? "border-[#26382D] bg-[#151C18] text-[#66756C]"
                          : "border-[#E5E8E3] bg-[#EEF0EC] text-[#8A928C]"
                      }`}
                    />

                    <span
                      className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold ${
                        isDark
                          ? "text-[#58675F]"
                          : "text-[#A0A7A1]"
                      }`}
                    >
                      EGP
                    </span>
                  </div>

                  <p
                    className={`mt-2 text-xs ${
                      isDark
                        ? "text-[#718078]"
                        : "text-[#939A95]"
                    }`}
                  >
                    السعر الحالي يتم تحديثه من خلال المزايدات.
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`mt-5 border shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${cardClass}`}
            >
              <div
                className={`border-b p-6 sm:p-7 ${cardHeaderClass}`}
              >
                <h2
                  className={`text-lg font-black ${headingClass}`}
                >
                  حالة المزاد
                </h2>

                <p className={`mt-1 text-xs ${mutedClass}`}>
                  الحالة الحالية للمزاد
                </p>
              </div>

              <div className="p-6 sm:p-7">
                <div
                  className={`mb-5 flex items-center gap-2 border px-4 py-3 text-sm font-bold ${statusStyle.container}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
                  />

                  {getStatusText(auction.status)}
                </div>

                <select
                  value={auction.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
                    )
                  }
                  className={`w-full border px-4 py-3 text-sm outline-none transition ${inputClass}`}
                >
                  <option value="pending">لم يبدأ</option>
                  <option value="active">نشط</option>
                  <option value="ended">منتهي</option>
                  <option value="cancelled">ملغي</option>
                </select>

                <p
                  className={`mt-3 text-xs leading-6 ${
                    isDark
                      ? "text-[#718078]"
                      : "text-[#939A95]"
                  }`}
                >
                  لا يمكنك تغيير حالة المزاد إلى مباع من صفحة التعديل.
                  يتم تعيينها تلقائيًا بعد إتمام الدفع.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div
          className={`mt-7 flex flex-col gap-3 border-t pt-7 sm:flex-row sm:justify-end ${
            isDark
              ? "border-[#26382D]"
              : "border-[#DDE1DB]"
          }`}
        >
          <button
            type="button"
            onClick={() => router.back()}
            disabled={
              updateAuction.isPending ||
              uploadImage.isPending ||
              saveImage.isPending ||
              removeImage.isPending
            }
            className={`border px-7 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark
                ? "border-[#2B4033] bg-[#111714] text-[#A8B5AD] hover:border-[#4E8063] hover:text-[#73B88A]"
                : "border-[#DDE1DB] bg-white text-[#657067] hover:border-[#315C45] hover:text-[#315C45]"
            }`}
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              updateAuction.isPending ||
              uploadImage.isPending ||
              saveImage.isPending ||
              removeImage.isPending
            }
            className="bg-[#315C45] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#264B38] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateAuction.isPending
              ? "جاري حفظ التعديلات..."
              : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </main>
  );
}