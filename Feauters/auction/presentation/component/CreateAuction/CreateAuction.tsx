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

  const [startingPrice, setStartingPrice] =
    useState<number>(0);

  const [status, setStatus] =
    useState<string>("pending");

  const [images, setImages] =
    useState<string[]>([]);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      for (const file of Array.from(files)) {
        const imageUrl =
          await uploadImage.mutateAsync({
            id: auctionId,
            image: file,
          });

        setImages((prev) => [
          ...prev,
          imageUrl,
        ]);
      }
    } catch (error) {
      console.error(
        "UPLOAD IMAGE ERROR:",
        error
      );
    }

    e.target.value = "";
  };

  const handleRemoveImage = async (
    imageUrl: string
  ) => {
    try {
      await removeImage.mutateAsync({
        id: auctionId,
        url: imageUrl,
      });

      setImages((prev) =>
        prev.filter((url) => url !== imageUrl)
      );
    } catch (error) {
      console.error(
        "REMOVE IMAGE ERROR:",
        error
      );
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
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
      console.error(
        "CREATE AUCTION ERROR:",
        error
      );
    }
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen px-6 py-10 transition-colors duration-300 ${
        isDark
          ? "bg-[#050706] text-[#E8EEE9]"
          : "bg-[#FCFAF5] text-[#2F342F]"
      }`}
    >
      <div className="mx-auto max-w-3xl">
        <h1
          className={`mb-8 text-3xl font-bold ${
            isDark
              ? "text-[#E8EEE9]"
              : "text-[#2F342F]"
          }`}
        >
          إنشاء مزاد
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`space-y-6 rounded-2xl border p-6 shadow-sm transition-colors duration-300 ${
            isDark
              ? "border-[#26382D] bg-[#111714]"
              : "border-[#E8E3D9] bg-white"
          }`}
        >
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              عنوان المزاد
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="مثال: تويوتا كورولا"
              className={`w-full rounded-xl border px-4 py-3 outline-none transition placeholder:text-[#68776E] ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#E8EEE9] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] placeholder:text-[#A5A9A2] focus:border-[#4F6F52] focus:ring-2 focus:ring-[#4F6F52]/20"
              }`}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              الوصف
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="اكتب وصف المزاد"
              rows={5}
              className={`w-full resize-none rounded-xl border px-4 py-3 outline-none transition placeholder:text-[#68776E] ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#E8EEE9] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] placeholder:text-[#A5A9A2] focus:border-[#4F6F52] focus:ring-2 focus:ring-[#4F6F52]/20"
              }`}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              القسم
            </label>

            <select
              value={category ?? ""}
              onChange={(e) =>
                setCategory(
                  e.target.value as AuctionCategory
                )
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#E8EEE9] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] focus:border-[#4F6F52] focus:ring-2 focus:ring-[#4F6F52]/20"
              }`}
            >
              <option value="">
                اختر القسم
              </option>

              <option value="cars">
                سيارات
              </option>

              <option value="real_estate">
                عقارات
              </option>

              <option value="furniture">
                أثاث
              </option>
            </select>
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              سعر البداية
            </label>

            <input
              type="number"
              min="0"
              value={startingPrice}
              onChange={(e) =>
                setStartingPrice(
                  Number(e.target.value)
                )
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#E8EEE9] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] focus:border-[#4F6F52] focus:ring-2 focus:ring-[#4F6F52]/20"
              }`}
            />
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              الحالة
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#E8EEE9] focus:border-[#4E8063] focus:ring-2 focus:ring-[#4E8063]/20"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] focus:border-[#4F6F52] focus:ring-2 focus:ring-[#4F6F52]/20"
              }`}
            >
              <option value="pending">
                في الانتظار
              </option>

              <option value="active">
                نشط
              </option>

              <option value="cancelled">
                ملغي
              </option>
            </select>
          </div>

          <div>
            <label
              className={`mb-2 block text-sm font-medium ${
                isDark
                  ? "text-[#D8E0DB]"
                  : "text-[#2F342F]"
              }`}
            >
              صور المزاد
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={uploadImage.isPending}
              className={`block w-full cursor-pointer rounded-xl border p-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                isDark
                  ? "border-[#26382D] bg-[#151C18] text-[#D8E0DB] file:mr-4 file:rounded-lg file:border-0 file:bg-[#1B2B22] file:px-4 file:py-2 file:font-medium file:text-[#73B88A] hover:file:bg-[#22382A]"
                  : "border-[#E8E3D9] bg-white text-[#2F342F] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF0E7] file:px-4 file:py-2 file:font-medium file:text-[#4F6F52] hover:file:bg-[#DDE8D9]"
              }`}
            />

            {uploadImage.isPending && (
              <p
                className={`mt-3 text-sm ${
                  isDark
                    ? "text-[#91A198]"
                    : "text-[#737A70]"
                }`}
              >
                جاري رفع الصورة...
              </p>
            )}
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {images.map((imageUrl) => (
                <div
                  key={imageUrl}
                  className={`relative overflow-hidden rounded-xl border ${
                    isDark
                      ? "border-[#26382D] bg-[#151C18]"
                      : "border-[#E8E3D9] bg-[#F8F6F0]"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt="Auction"
                    className="h-40 w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(imageUrl)
                    }
                    disabled={
                      removeImage.isPending
                    }
                    className={`absolute right-2 top-2 rounded-lg px-3 py-1 text-sm font-medium shadow-sm backdrop-blur-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      isDark
                        ? "bg-[#111714]/90 text-[#D47777] hover:bg-red-600 hover:text-white"
                        : "bg-white/90 text-red-600 hover:bg-red-600 hover:text-white"
                    }`}
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={
              createAuction.isPending ||
              uploadImage.isPending ||
              removeImage.isPending
            }
            className={`w-full rounded-xl px-5 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark
                ? "bg-[#315C45] hover:bg-[#264B38]"
                : "bg-[#4F6F52] hover:bg-[#3F5C42]"
            }`}
          >
            {createAuction.isPending
              ? "جاري إنشاء المزاد..."
              : "إنشاء المزاد"}
          </button>
        </form>
      </div>
    </div>
  );
}
