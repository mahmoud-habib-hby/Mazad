"use client";

import { useState } from "react";
import { useChangeEmail } from "../../hooks/useChangeEmail";

interface ChangeEmailProps {
  userId: string;
  currentEmail: string;
  onSuccess?: () => void;
}

export default function ChangeEmail({
  userId,
  currentEmail,
  onSuccess,
}: ChangeEmailProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [email, setEmail] = useState(currentEmail);

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useChangeEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      await mutateAsync({
        userId,
        email,
      });

      setShowEdit(false);
      onSuccess?.();

    } catch (error) {
      console.error("CHANGE EMAIL ERROR:", error);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-[#806f5e]">
          البريد الإلكتروني
        </label>

        {!showEdit && (
          <button
            type="button"
            onClick={() => {
              setEmail(currentEmail);
              setShowEdit(true);
            }}
            className="text-sm font-medium text-[#8b5e34] hover:underline"
          >
            تعديل
          </button>
        )}
      </div>

      {!showEdit ? (
        /* العرض العادي */
        <div className="w-full bg-[#f5efe6] border border-[#e5d8c8] rounded-xl px-4 py-3 text-[#2f2924]">
          {currentEmail || "غير محدد"}
        </div>
      ) : (
        /* نموذج التعديل */
        <form
          onSubmit={handleSubmit}
          className="bg-[#f5efe6] border border-[#e5d8c8] rounded-xl p-4"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل البريد الإلكتروني الجديد"
            className="w-full bg-white border border-[#d8c8b6] rounded-lg px-4 py-3 outline-none focus:border-[#8b5e34]"
          />

          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {error instanceof Error
                ? error.message
                : "حدث خطأ أثناء تعديل البريد الإلكتروني"}
            </p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#8b5e34] text-white px-5 py-2.5 rounded-lg disabled:opacity-50"
            >
              {isPending ? "جاري الإرسال..." : "إرسال التعديل"}
            </button>

            <button
              type="button"
              onClick={() => setShowEdit(false)}
              disabled={isPending}
              className="bg-white border border-[#d8c8b6] text-[#4a4036] px-5 py-2.5 rounded-lg"
            >
              إلغاء
            </button>
          </div>
        </form>
      )}
    </div>
  );
}