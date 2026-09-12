"use client";

import { useState } from "react";
import { useChangePassword } from "../../hooks/useChangePassword";

interface ChangePasswordProps {
  userId: string;
}

export default function ChangePassword({
  userId,
}: ChangePasswordProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) return;

    if (password !== confirmPassword) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      await mutateAsync({
        userId,
        password,
      });

      setPassword("");
      setConfirmPassword("");
      setShowEdit(false);

      alert("تم تغيير كلمة المرور بنجاح");
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
    }
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm text-[#806f5e]">
          كلمة المرور
        </label>

        {!showEdit && (
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="text-sm text-[#8b5e34] hover:underline"
          >
            تعديل
          </button>
        )}
      </div>

      {!showEdit ? (
        <div className="bg-[#f5efe6] border border-[#e5d8c8] rounded-xl px-4 py-3">
          ••••••••
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#f5efe6] border border-[#e5d8c8] rounded-xl p-4"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة"
            className="w-full bg-white border border-[#d8c8b6] rounded-lg px-4 py-3 outline-none mb-3"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="تأكيد كلمة المرور"
            className="w-full bg-white border border-[#d8c8b6] rounded-lg px-4 py-3 outline-none"
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