"use client";

import { useState } from "react";
import { UseLogin } from "../hooks/UseLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutateAsync, isPending, error } = UseLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

      const result = await mutateAsync({
        email,
        password,
      });

      console.log("Login result:", result);

  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">
            Mazad
          </h1>

          <p className="text-gray-500 mt-2">
            مرحبًا بعودتك
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            تسجيل الدخول
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                البريد الإلكتروني
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                disabled={isPending}
                className="w-full rounded-xl border border-gray-300
                  bg-white px-4 py-3
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none transition
                  focus:border-green-500
                  focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  كلمة المرور
                </label>

                <a
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  نسيت كلمة المرور؟
                </a>

              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isPending}
                className="w-full rounded-xl border border-gray-300
                  bg-white px-4 py-3
                  text-gray-900
                  placeholder:text-gray-400
                  outline-none transition
                  focus:border-green-500
                  focus:ring-2 focus:ring-green-100
                  disabled:bg-gray-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm text-red-600">
                  {error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء تسجيل الدخول"}
                </p>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-xl bg-green-600 py-3.5
                font-semibold text-white
                transition
                hover:bg-green-700
                focus:outline-none
                focus:ring-2 focus:ring-green-500
                focus:ring-offset-2
                disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {isPending
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>

          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-6">
            ليس لديك حساب؟{" "}

            <a
              href="/register"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              إنشاء حساب
            </a>
          </p>

        </div>
      </div>
    </main>
  );
}