"use client";

import { useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

import { UseGetProfileInfo } from "../../hooks/useGetProfileInfo";

import ChangeImage from "./ChangeImage";
import ChangeName from "./ChangeName";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

import { UseThemStor } from "@/stor/themStor";

export default function ProfilePage() {
  const {
    mutate,
    data: profile,
    isPending,
    isError,
    error,
  } = UseGetProfileInfo();

  const isDark = UseThemStor((state) => state.isDark);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error(error);
        return;
      }

      mutate(user.id);
    };

    getUser();
  }, [mutate]);

  const pageBg = isDark ? "bg-[#050706]" : "bg-[#f5efe6]";
  const cardBg = isDark ? "bg-[#111714]" : "bg-[#fffaf3]";
  const sectionBg = isDark ? "bg-[#0D120F]" : "bg-[#fdf8f0]";
  const softBg = isDark ? "bg-[#151C18]" : "bg-[#f5efe6]";

  const border = isDark
    ? "border-[#26382D]"
    : "border-[#e5d8c8]";

  const text = isDark
    ? "text-[#E8EEE9]"
    : "text-[#2f2924]";

  const secondaryText = isDark
    ? "text-[#91A198]"
    : "text-[#806f5e]";

  if (isPending) {
    return (
      <div
        dir="rtl"
        className={`min-h-screen px-4 py-12 ${pageBg}`}
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-3">
            <div
              className={`h-9 w-48 animate-pulse rounded-lg ${
                isDark ? "bg-[#151C18]" : "bg-[#e5d8c8]"
              }`}
            />

            <div
              className={`h-4 w-72 animate-pulse rounded ${
                isDark ? "bg-[#151C18]" : "bg-[#e5d8c8]"
              }`}
            />
          </div>

          <div
            className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg} ${border}`}
          >
            <div className={`border-b p-8 ${border}`}>
              <div className="flex items-center gap-5">
                <div
                  className={`h-24 w-24 animate-pulse rounded-full ${
                    isDark ? "bg-[#151C18]" : "bg-[#e5d8c8]"
                  }`}
                />

                <div className="space-y-3">
                  <div
                    className={`h-6 w-40 animate-pulse rounded ${
                      isDark ? "bg-[#151C18]" : "bg-[#e5d8c8]"
                    }`}
                  />

                  <div
                    className={`h-4 w-56 animate-pulse rounded ${
                      isDark ? "bg-[#151C18]" : "bg-[#e5d8c8]"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8 p-8">
              <div
                className={`h-32 animate-pulse rounded-2xl ${
                  isDark ? "bg-[#151C18]" : "bg-[#f5efe6]"
                }`}
              />

              <div
                className={`h-24 animate-pulse rounded-2xl ${
                  isDark ? "bg-[#151C18]" : "bg-[#f5efe6]"
                }`}
              />

              <div
                className={`h-24 animate-pulse rounded-2xl ${
                  isDark ? "bg-[#151C18]" : "bg-[#f5efe6]"
                }`}
              />

              <div
                className={`h-24 animate-pulse rounded-2xl ${
                  isDark ? "bg-[#151C18]" : "bg-[#f5efe6]"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-4 ${pageBg}`}
      >
        <div className="w-full max-w-lg">
          <div
            className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg} ${
              isDark ? "border-[#4A2729]" : "border-red-200"
            }`}
          >
            <div
              className={`border-b px-8 py-6 ${
                isDark
                  ? "border-[#4A2729] bg-[#241819]"
                  : "border-red-100 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    isDark
                      ? "border-[#4A2729] bg-[#1B1314]"
                      : "border-red-200 bg-white"
                  }`}
                >
                  <span
                    className={`text-xl font-bold ${
                      isDark ? "text-[#D47777]" : "text-red-600"
                    }`}
                  >
                    !
                  </span>
                </div>

                <div>
                  <h1 className={`text-xl font-bold ${text}`}>
                    تعذر تحميل الملف الشخصي
                  </h1>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    حدثت مشكلة أثناء جلب بيانات حسابك
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div
                className={`rounded-2xl border p-5 ${
                  isDark
                    ? "border-[#4A2729] bg-[#241819]"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <p
                  className={`text-sm leading-7 ${
                    isDark ? "text-[#D47777]" : "text-red-700"
                  }`}
                >
                  {error instanceof Error
                    ? error.message
                    : "حدث خطأ أثناء تحميل البيانات"}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <p className={`text-xs ${secondaryText}`}>
                  حاول تحديث الصفحة مرة أخرى
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className={`rounded-xl px-5 py-2.5 text-sm font-medium text-white transition ${
                    isDark
                      ? "bg-[#315C45] hover:bg-[#264B38]"
                      : "bg-[#4a4036] hover:bg-[#2f2924]"
                  }`}
                >
                  إعادة المحاولة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        dir="rtl"
        className={`flex min-h-screen items-center justify-center px-4 ${pageBg}`}
      >
        <div
          className={`w-full max-w-lg rounded-3xl border p-10 text-center shadow-sm ${cardBg} ${border}`}
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${softBg} ${border}`}
          >
            <span className={`text-2xl ${secondaryText}`}>
              ؟
            </span>
          </div>

          <h1 className={`mt-5 text-2xl font-bold ${text}`}>
            لا توجد بيانات
          </h1>

          <p className={`mt-2 text-sm ${secondaryText}`}>
            لم نتمكن من العثور على بيانات الملف الشخصي.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className={`min-h-screen px-4 py-10 md:py-14 ${pageBg}`}
    >
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p
                className={`mb-2 text-sm font-medium ${secondaryText}`}
              >
                إعدادات الحساب
              </p>

              <h1
                className={`text-3xl font-bold md:text-4xl ${text}`}
              >
                الملف الشخصي
              </h1>

              <p
                className={`mt-3 max-w-xl text-sm leading-7 md:text-base ${secondaryText}`}
              >
                يمكنك من هنا إدارة معلومات حسابك الشخصية وتحديث
                الصورة والاسم والبريد الإلكتروني وكلمة المرور.
              </p>
            </div>

            <div
              className={`hidden h-16 w-16 items-center justify-center rounded-2xl border shadow-sm md:flex ${cardBg} ${border}`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl border ${softBg} ${border}`}
              >
                <span
                  className={`font-bold ${
                    isDark
                      ? "text-[#73B88A]"
                      : "text-[#4a4036]"
                  }`}
                >
                  م
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg} ${border}`}
        >

          <div className={`relative border-b px-6 py-8 md:px-10 ${border}`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <div className="relative shrink-0">
                <div
                  className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 shadow-sm ${
                    isDark
                      ? "border-[#111714] bg-[#151C18] ring-1 ring-[#26382D]"
                      : "border-[#fffaf3] bg-[#f5efe6] ring-1 ring-[#e5d8c8]"
                  }`}
                >
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="الصورة الشخصية"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className={`text-3xl font-bold ${secondaryText}`}
                    >
                      {profile.name?.charAt(0) || "؟"}
                    </span>
                  )}
                </div>

                <div
                  className={`absolute bottom-1 left-1 flex h-5 w-5 items-center justify-center rounded-full ${
                    isDark ? "bg-[#111714]" : "bg-[#fffaf3]"
                  }`}
                >
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className={`text-2xl font-bold ${text}`}>
                    {profile.name || "بدون اسم"}
                  </h2>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${
                      isDark
                        ? "border-[#26382D] bg-[#1B2B22] text-[#73B88A]"
                        : "border-[#e5d8c8] bg-[#f5efe6] text-[#806f5e]"
                    }`}
                  >
                    حساب شخصي
                  </span>
                </div>

                <p
                  dir="ltr"
                  className={`mt-2 truncate text-right text-sm ${secondaryText}`}
                >
                  {profile.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <div
                    className={`rounded-xl border px-3 py-2 ${softBg} ${border}`}
                  >
                    <p className={`text-[11px] ${secondaryText}`}>
                      حالة الحساب
                    </p>

                    <p
                      className={`mt-0.5 text-sm font-medium ${
                        isDark
                          ? "text-[#73B88A]"
                          : "text-[#2f2924]"
                      }`}
                    >
                      نشط
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`border-b px-6 py-6 md:px-10 ${sectionBg} ${border}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${softBg} ${border}`}
              >
                <span
                  className={`font-bold ${
                    isDark
                      ? "text-[#73B88A]"
                      : "text-[#4a4036]"
                  }`}
                >
                  ⚙
                </span>
              </div>

              <div>
                <h3 className={`font-semibold ${text}`}>
                  معلومات الحساب
                </h3>

                <p
                  className={`mt-1 text-sm leading-6 ${secondaryText}`}
                >
                  قم بتحديث بياناتك الشخصية من الأقسام التالية.
                  كل قسم مستقل ويمكن تعديله بشكل منفصل.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 md:px-10">

            <section className="py-8">
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${softBg} ${border}`}
                >
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-[#73B88A]"
                        : "text-[#4a4036]"
                    }`}
                  >
                    01
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${text}`}>
                    الصورة الشخصية
                  </h3>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    قم بتغيير صورة حسابك الشخصية
                  </p>
                </div>
              </div>

              <ChangeImage
                userId={profile.userId}
                currentImage={profile.image}
              />
            </section>

            <section className={`border-t py-8 ${border}`}>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${softBg} ${border}`}
                >
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-[#73B88A]"
                        : "text-[#4a4036]"
                    }`}
                  >
                    02
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${text}`}>
                    الاسم
                  </h3>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    الاسم الظاهر في حسابك
                  </p>
                </div>
              </div>

              <ChangeName
                userId={profile.userId}
                currentName={profile.name}
              />
            </section>

            <section className={`border-t py-8 ${border}`}>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${softBg} ${border}`}
                >
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-[#73B88A]"
                        : "text-[#4a4036]"
                    }`}
                  >
                    03
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${text}`}>
                    البريد الإلكتروني
                  </h3>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    البريد المرتبط بحسابك
                  </p>
                </div>
              </div>

              <ChangeEmail
                userId={profile.userId}
                currentEmail={profile.email}
              />
            </section>

            <section className={`border-t py-8 ${border}`}>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${softBg} ${border}`}
                >
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-[#73B88A]"
                        : "text-[#4a4036]"
                    }`}
                  >
                    04
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${text}`}>
                    كلمة المرور
                  </h3>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    حماية حسابك وتغيير كلمة المرور
                  </p>
                </div>
              </div>

              <ChangePassword userId={profile.userId} />
            </section>

            <section className={`border-t py-8 ${border}`}>
              <div className="mb-6 flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${softBg} ${border}`}
                >
                  <span
                    className={`font-bold ${
                      isDark
                        ? "text-[#73B88A]"
                        : "text-[#4a4036]"
                    }`}
                  >
                    05
                  </span>
                </div>

                <div>
                  <h3 className={`text-lg font-bold ${text}`}>
                    معرف المستخدم
                  </h3>

                  <p className={`mt-1 text-sm ${secondaryText}`}>
                    المعرف الفريد الخاص بحسابك
                  </p>
                </div>
              </div>

              <div>
                <div
                  dir="ltr"
                  className={`w-full select-all break-all rounded-2xl border px-5 py-4 font-mono text-sm ${softBg} ${border} ${text}`}
                >
                  {profile.userId}
                </div>

                <p className={`mt-2 text-xs ${secondaryText}`}>
                  هذا المعرف للعرض فقط ولا يمكن تعديله.
                </p>
              </div>
            </section>
          </div>

          <div
            className={`border-t px-6 py-6 md:px-10 ${sectionBg} ${border}`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className={`text-sm font-semibold ${text}`}>
                  خصوصية الحساب
                </h3>

                <p className={`mt-1 text-xs ${secondaryText}`}>
                  تأكد من أن بيانات حسابك محدثة وآمنة.
                </p>
              </div>

              <div
                className={`flex items-center gap-2 text-xs ${secondaryText}`}
              >
                <span className="h-2 w-2 rounded-full bg-green-500" />
                الحساب متصل
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className={`rounded-2xl border p-5 shadow-sm ${cardBg} ${border}`}
          >
            <p className={`text-xs ${secondaryText}`}>
              الحساب
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                isDark
                  ? "text-[#73B88A]"
                  : "text-[#2f2924]"
              }`}
            >
              نشط
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm ${cardBg} ${border}`}
          >
            <p className={`text-xs ${secondaryText}`}>
              البيانات
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                isDark
                  ? "text-[#73B88A]"
                  : "text-[#2f2924]"
              }`}
            >
              محدثة
            </p>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm ${cardBg} ${border}`}
          >
            <p className={`text-xs ${secondaryText}`}>
              الأمان
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                isDark
                  ? "text-[#73B88A]"
                  : "text-[#2f2924]"
              }`}
            >
              محمي
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
