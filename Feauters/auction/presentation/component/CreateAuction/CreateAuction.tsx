"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { UseCreateAuction } from "../../hooks/UseCreateAuction";
import { useUploadImage } from "../../hooks/UseUploadImage";
import { UseRermoveImage } from "../../hooks/useRemoveImage";

import { AuctionCategory } from "@/Feauters/auction/domain/entity/CategoryData";
import { UseThemStor } from "@/stor/themStor";

export default function CreateAuctionPage() {
  const router = useRouter();

  const createAuction = UseCreateAuction();
  const uploadImage = useUploadImage();
  const removeImage = UseRermoveImage();

  const isDark = UseThemStor((state) => state.isDark);

  const [auctionId] = useState(() => crypto.randomUUID());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<AuctionCategory | undefined>(undefined);
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [status, setStatus] = useState<string>("pending");
  const [images, setImages] = useState<string[]>([]);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadImage.mutateAsync({
          id: auctionId,
          image: file,
        });

        setImages((prev) => [...prev, imageUrl]);
      }
    } catch (error) {
      console.error("UPLOAD IMAGE ERROR:", error);
    }

    e.target.value = "";
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      await removeImage.mutateAsync({
        id: auctionId,
        url: imageUrl,
      });

      setImages((prev) => prev.filter((url) => url !== imageUrl));
    } catch (error) {
      console.error("REMOVE IMAGE ERROR:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("اكتب عنوان المزاد");
      return;
    }

    if (!description.trim()) {
      alert("اكتب وصف المزاد");
      return;
    }

    if (!category) {
      alert("اختر القسم");
      return;
    }

    if (startingPrice <= 0) {
      alert("أدخل سعر البداية");
      return;
    }

    try {
      await createAuction.mutateAsync({
        id: auctionId,
        title,
        description,
        category,
        starting_price: startingPrice,
        current_price: startingPrice,
        status,
        images,
      });

      router.push("/auctions");
    } catch (error) {
      console.error("CREATE AUCTION ERROR:", error);
    }
  };

  const pageBg = isDark ? "bg-[#050706]" : "bg-[#F7F5F0]";
  const cardBg = isDark ? "bg-[#0D120F]" : "bg-white";
  const inputBg = isDark ? "bg-[#151C18]" : "bg-[#FAF9F6]";
  const border = isDark ? "border-[#26382D]" : "border-[#E5E0D7]";
  const text = isDark ? "text-[#E8EEE9]" : "text-[#252825]";
  const secondary = isDark ? "text-[#91A198]" : "text-[#777A74]";

  return (
    <main
      dir="rtl"
      className={`min-h-screen ${pageBg} px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                isDark ? "bg-[#1B2B22]" : "bg-[#EAF0E7]"
              }`}
            >
              <span
                className={`text-xl ${
                  isDark ? "text-[#73B88A]" : "text-[#315C45]"
                }`}
              >
                +
              </span>
            </div>

            <div>
              <p
                className={`text-sm font-medium ${
                  isDark ? "text-[#73B88A]" : "text-[#4F6F52]"
                }`}
              >
                MAZAD
              </p>

              <h1 className={`text-2xl font-bold sm:text-3xl ${text}`}>
                إنشاء مزاد جديد
              </h1>
            </div>
          </div>

          <p className={`max-w-2xl text-sm leading-7 ${secondary}`}>
            أضف تفاصيل المنتج والصور وحدد السعر المناسب لبدء المزاد.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <section
              className={`rounded-3xl border ${border} ${cardBg} p-5 shadow-sm sm:p-7`}
            >
              <div className="mb-7">
                <h2 className={`text-lg font-bold ${text}`}>
                  معلومات المزاد
                </h2>

                <p className={`mt-1 text-sm ${secondary}`}>
                  أدخل البيانات الأساسية الخاصة بالمزاد.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${text}`}
                  >
                    عنوان المزاد
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: تويوتا كورولا 2020"
                    className={`w-full rounded-2xl border ${border} ${inputBg} ${text} px-4 py-3.5 text-sm outline-none transition placeholder:text-[#8B938D] focus:border-[#4E8063] focus:ring-4 focus:ring-[#4E8063]/10`}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${text}`}
                  >
                    وصف المزاد
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصفًا واضحًا ومفصلًا للمنتج..."
                    rows={7}
                    className={`w-full resize-none rounded-2xl border ${border} ${inputBg} ${text} px-4 py-3.5 text-sm leading-7 outline-none transition placeholder:text-[#8B938D] focus:border-[#4E8063] focus:ring-4 focus:ring-[#4E8063]/10`}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      className={`mb-2 block text-sm font-semibold ${text}`}
                    >
                      القسم
                    </label>

                    <select
                      value={category ?? ""}
                      onChange={(e) =>
                        setCategory(e.target.value as AuctionCategory)
                      }
                      className={`w-full rounded-2xl border ${border} ${inputBg} ${text} px-4 py-3.5 text-sm outline-none transition focus:border-[#4E8063] focus:ring-4 focus:ring-[#4E8063]/10`}
                    >
                      <option value="">اختر القسم</option>
                      <option value="cars">سيارات</option>
                      <option value="real_estate">عقارات</option>
                      <option value="furniture">أثاث</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`mb-2 block text-sm font-semibold ${text}`}
                    >
                      سعر البداية
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={startingPrice}
                        onChange={(e) =>
                          setStartingPrice(Number(e.target.value))
                        }
                        className={`w-full rounded-2xl border ${border} ${inputBg} ${text} px-4 py-3.5 pl-16 text-sm outline-none transition focus:border-[#4E8063] focus:ring-4 focus:ring-[#4E8063]/10`}
                      />

                      <span
                        className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium ${secondary}`}
                      >
                        جنيه
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${text}`}
                  >
                    حالة المزاد
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full rounded-2xl border ${border} ${inputBg} ${text} px-4 py-3.5 text-sm outline-none transition focus:border-[#4E8063] focus:ring-4 focus:ring-[#4E8063]/10`}
                  >
                    <option value="pending">في الانتظار</option>
                    <option value="active">نشط</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
            </section>

            <section
              className={`h-fit rounded-3xl border ${border} ${cardBg} p-5 shadow-sm sm:p-6`}
            >
              <div className="mb-6">
                <h2 className={`text-lg font-bold ${text}`}>
                  صور المنتج
                </h2>

                <p className={`mt-1 text-sm leading-6 ${secondary}`}>
                  أضف صورًا واضحة للمنتج لمساعدة المشترين على اتخاذ القرار.
                </p>
              </div>

              <label
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed ${
                  isDark
                    ? "border-[#31483A] bg-[#101713] hover:border-[#4E8063]"
                    : "border-[#D9D4CA] bg-[#FAF9F6] hover:border-[#7B947E]"
                } px-5 py-8 text-center transition`}
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                    isDark ? "bg-[#1B2B22]" : "bg-[#EAF0E7]"
                  }`}
                >
                  <span
                    className={`text-2xl ${
                      isDark ? "text-[#73B88A]" : "text-[#4F6F52]"
                    }`}
                  >
                    ↑
                  </span>
                </div>

                <span className={`text-sm font-semibold ${text}`}>
                  اضغط لاختيار الصور
                </span>

                <span className={`mt-2 text-xs ${secondary}`}>
                  يمكنك اختيار أكثر من صورة
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={uploadImage.isPending}
                  className="hidden"
                />
              </label>

              {uploadImage.isPending && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-center text-sm ${
                    isDark
                      ? "bg-[#1B2B22] text-[#73B88A]"
                      : "bg-[#EAF0E7] text-[#4F6F52]"
                  }`}
                >
                  جاري رفع الصور...
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {images.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      className={`group relative overflow-hidden rounded-2xl border ${border} ${inputBg}`}
                    >
                      <img
                        src={imageUrl}
                        alt={`Auction ${index + 1}`}
                        className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imageUrl)}
                        disabled={removeImage.isPending}
                        className="absolute right-2 top-2 rounded-xl bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <div
            className={`mt-6 flex flex-col gap-3 rounded-3xl border ${border} ${cardBg} p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5`}
          >
            <div>
              <p className={`font-semibold ${text}`}>
                جاهز لإنشاء المزاد؟
              </p>

              <p className={`mt-1 text-xs ${secondary}`}>
                تأكد من صحة البيانات قبل النشر.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                createAuction.isPending ||
                uploadImage.isPending ||
                removeImage.isPending
              }
              className={`rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? "bg-[#315C45] hover:bg-[#3D6F52]"
                  : "bg-[#315C45] hover:bg-[#264B38]"
              }`}
            >
              {createAuction.isPending
                ? "جاري إنشاء المزاد..."
                : "إنشاء المزاد"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
