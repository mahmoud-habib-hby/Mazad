"use client";

import { useState } from "react";
import { useChangeName } from "../../hooks/useChangeName";

interface ChangeNameProps {
  userId: string;
  currentName: string;
}

export default function ChangeName({
  userId,
  currentName,
}: ChangeNameProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(currentName);

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useChangeName();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await mutateAsync({
        userId,
        name,
      });

      setShowEdit(false);
    } catch (error) {
      console.error("CHANGE NAME ERROR:", error);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-[#806f5e]">
          الاسم
        </label>

        {!showEdit && (
          <button
            type="button"
            onClick={() => {
              setName(currentName);
              setShowEdit(true);
            }}
            className="text-sm text-[#8b5e34] hover:underline"
          >
            تعديل
          </button>
        )}
      </div>

      {!showEdit ? (
        <div className="bg-[#f5efe6] border border-[#e5d8c8] rounded-xl px-4 py-3">
          {currentName || "غير محدد"}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#f5efe6] border border-[#e5d8c8] rounded-xl p-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-[#d8c8b6] rounded-lg px-4 py-3 outline-none"
            placeholder="أدخل الاسم الجديد"
          />

          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {error instanceof Error
                ? error.message
                : "حدث خطأ"}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#8b5e34] text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
            >
              {isPending ? "جاري الحفظ..." : "إرسال التعديل"}
            </button>

            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="bg-white border border-[#d8c8b6] px-5 py-2.5 rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}