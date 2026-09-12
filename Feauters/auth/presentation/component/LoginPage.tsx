"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UseLogin } from "../hooks/UseLogin";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("mh77@gmail.com");
  const [password, setPassword] = useState("7777777");

  const { mutateAsync, isPending, error } = UseLogin();

  useEffect(() => {
    const supabase = createClient();

    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/auctions");
      }
    };

    check();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await mutateAsync({
        email,
        password,
      });

      console.log("Login result:", result);

      router.push("/auctions");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f5efe6] px-4 py-10"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#315C45] text-xl font-black text-white shadow-lg shadow-[#315C45]/20">
            M
          </div>

          <h1 className="text-3xl font-black tracking-tight text-[#2f2924]">
            Mazad
          </h1>

          <p className="mt-2 text-sm text-[#806f5e]">
            مرحبًا بعودتك
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-[#e5d8c8] bg-[#fffaf3] p-6 shadow-xl shadow-[#4a4036]/5 sm:p-8">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#2f2924]">
              تسجيل الدخول
            </h2>

            <p className="mt-2 text-sm text-[#806f5e]">
              سجّل الدخول للوصول إلى حسابك
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#4a4036]"
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
                className="
                  w-full rounded-xl
                  border border-[#e5d8c8]
                  bg-white
                  px-4 py-3
                  text-[#2f2924]
                  outline-none
                  transition
                  placeholder:text-[#b2a394]
                  focus:border-[#315C45]
                  focus:ring-2
                  focus:ring-[#315C45]/15
                  disabled:cursor-not-allowed
                  disabled:bg-[#f5efe6]
                  disabled:opacity-60
                "
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-[#4a4036]"
                >
                  كلمة المرور
                </label>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isPending}
                className="
                  w-full rounded-xl
                  border border-[#e5d8c8]
                  bg-white
                  px-4 py-3
                  text-[#2f2924]
                  outline-none
                  transition
                  placeholder:text-[#b2a394]
                  focus:border-[#315C45]
                  focus:ring-2
                  focus:ring-[#315C45]/15
                  disabled:cursor-not-allowed
                  disabled:bg-[#f5efe6]
                  disabled:opacity-60
                "
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-6 text-red-600">
                  {error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء تسجيل الدخول"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="
                w-full rounded-xl
                bg-[#315C45]
                py-3.5
                font-bold
                text-white
                shadow-lg
                shadow-[#315C45]/10
                transition
                hover:bg-[#264B38]
                focus:outline-none
                focus:ring-2
                focus:ring-[#315C45]
                focus:ring-offset-2
                focus:ring-offset-[#fffaf3]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isPending
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-7 border-t border-[#e5d8c8] pt-6">
            <p className="text-center text-sm text-[#806f5e]">
              ليس لديك حساب؟{" "}
              <a
                href="/register"
                className="font-bold text-[#315C45] transition hover:text-[#264B38]"
              >
                إنشاء حساب
              </a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#a19384]">
          منصة Mazad للمزادات
        </p>
      </div>
    </main>
  );
}
