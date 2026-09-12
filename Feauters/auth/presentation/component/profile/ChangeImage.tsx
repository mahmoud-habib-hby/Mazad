"use client";

import { useState } from "react";
import { UseSaveImage } from "../../hooks/useSaveImage";
import { UseRemoveImage } from "../../hooks/useRemoveImage";
import { UseUploadImage } from "../../hooks/useUploadImage";


interface ChangeImageProps {
  userId: string;
  currentImage: string;
}

export default function ChangeImage({
  userId,
  currentImage,
}: ChangeImageProps) {
  const [showEdit, setShowEdit] = useState(false);

  // الصورة التي تظهر حاليًا
  const [image, setImage] = useState<string>(currentImage);

  // الصورة الجديدة التي تم رفعها ولم يتم حفظها بعد
  const [newImageUrl, setNewImageUrl] = useState<string>("");

  const uploadImage = UseUploadImage();
  const saveImage = UseSaveImage();
  const removeImage = UseRemoveImage();

  // =========================
  // اختيار صورة جديدة
  // =========================
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const url = await uploadImage.mutateAsync({
        userId,
        file,
      });

      // حفظ رابط الصورة الجديدة مؤقتًا
      setNewImageUrl(url);

      // عرض الصورة الجديدة مباشرة
      setImage(url);
    } catch (error) {
      console.error("UPLOAD IMAGE ERROR:", error);
    }
  };

  // =========================
  // حذف الصورة المختارة
  // =========================
  const handleDelete = async () => {
    if (!newImageUrl) return;

    try {
      // حذف الصورة الجديدة من Storage
      await removeImage.mutateAsync({
        userId,
        imageUrl: newImageUrl,
      });

      // الرجوع للصورة القديمة
      setImage(currentImage);

      // إلغاء الصورة الجديدة
      setNewImageUrl("");
    } catch (error) {
      console.error("REMOVE IMAGE ERROR:", error);
    }
  };

  // =========================
  // حفظ التعديل
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!newImageUrl) {
      setShowEdit(false);
      return;
    }

    try {
      // أولًا حفظ URL في auth.users
      await saveImage.mutateAsync({
        userId,
        imageUrl: newImageUrl,
      });

      // بعد نجاح الحفظ نحذف الصورة القديمة
      if (currentImage) {
        await removeImage.mutateAsync({
          userId,
          imageUrl: currentImage,
        });
      }

      // الصورة الجديدة أصبحت هي الحالية
      setNewImageUrl("");
      setShowEdit(false);

      // تحديث الصفحة لإظهار البيانات الجديدة
      window.location.reload();
    } catch (error) {
      console.error("SAVE IMAGE ERROR:", error);
    }
  };

  // =========================
  // إلغاء التعديل
  // =========================
  const handleCancel = async () => {
    // لو تم رفع صورة جديدة بالفعل
    // نحذفها من Storage لأنها لم تُحفظ
    if (newImageUrl) {
      try {
        await removeImage.mutateAsync({
          userId,
          imageUrl: newImageUrl,
        });
      } catch (error) {
        console.error("REMOVE NEW IMAGE ERROR:", error);
      }
    }

    // الرجوع للصورة القديمة
    setImage(currentImage);
    setNewImageUrl("");
    setShowEdit(false);
  };

  return (
    <div className="border-b border-[#e5d8c8] pb-6 mb-6">
      {/* العنوان */}
      <label className="block text-sm text-[#806f5e] mb-3">
        الصورة الشخصية
      </label>

      {/* الصورة */}
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-[#e5d8c8] bg-[#f5efe6] flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="الصورة الشخصية"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-[#806f5e]">
              لا توجد صورة
            </span>
          )}
        </div>

        {/* زر تعديل */}
        {!showEdit && (
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="px-5 py-2 rounded-xl bg-[#4a4036] text-white hover:bg-[#2f2924] transition"
          >
            تعديل
          </button>
        )}
      </div>

      {/* نموذج التعديل */}
      {showEdit && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 space-y-4"
        >
          {/* اختيار الصورة */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadImage.isPending}
              className="block w-full text-sm text-[#4a4036]"
            />
          </div>

          {/* حالة الرفع */}
          {uploadImage.isPending && (
            <p className="text-sm text-[#806f5e]">
              جاري رفع الصورة...
            </p>
          )}

          {/* Preview للصورة الجديدة */}
          {newImageUrl && (
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#e5d8c8]">
                <img
                  src={newImageUrl}
                  alt="الصورة الجديدة"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* زر حذف */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={removeImage.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
              >
                {removeImage.isPending
                  ? "جاري الحذف..."
                  : "حذف"}
              </button>
            </div>
          )}

          {/* الأزرار */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={
                !newImageUrl ||
                saveImage.isPending ||
                uploadImage.isPending
              }
              className="px-5 py-2 rounded-xl bg-[#4a4036] text-white hover:bg-[#2f2924] disabled:opacity-50 transition"
            >
              {saveImage.isPending
                ? "جاري الحفظ..."
                : "إرسال التعديل"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={
                saveImage.isPending ||
                removeImage.isPending
              }
              className="px-5 py-2 rounded-xl border border-[#d8c8b5] text-[#4a4036] hover:bg-[#f5efe6] transition"
            >
              إلغاء
            </button>
          </div>

          {/* الأخطاء */}
          {uploadImage.isError && (
            <p className="text-sm text-red-600">
              {uploadImage.error.message}
            </p>
          )}

          {saveImage.isError && (
            <p className="text-sm text-red-600">
              {saveImage.error.message}
            </p>
          )}

          {removeImage.isError && (
            <p className="text-sm text-red-600">
              {removeImage.error.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}