"use client";

import { useState } from "react";
import { UseRegister } from "../hooks/UseReister";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isPending, error } = UseRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


      const result = await mutateAsync({
        name,
        phone,
        email,
        password,
      });

      console.log("Register result:", result);
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600">
            Mazad
          </h1>

          <p className="text-gray-500 mt-2">
            أنشئ حسابك وابدأ في المزايدة
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            إنشاء حساب
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                الاسم
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك"
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

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                رقم الهاتف
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                كلمة المرور
              </label>

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
                    : "حدث خطأ أثناء إنشاء الحساب"}
                </p>
              </div>
            )}

            

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
                ? "جاري إنشاء الحساب..."
                : "إنشاء حساب"}
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟{" "}

            <Link
              href="/"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              تسجيل الدخول
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}