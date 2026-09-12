"use client";

import { UseThemStor } from "@/stor/themStor";
import Link from "next/link";

export default function Footer() {
  const theme = UseThemStor((e) => e.isDark);

  return (
    <footer
      dir="rtl"
      className={`border-t transition-colors duration-300 ${
        theme
          ? "border-[#26382D] bg-[#050706]"
          : "border-[#E5DED3] bg-[#FFFDF8]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold text-white ${
                  theme ? "bg-[#315C45]" : "bg-[#315C45]"
                }`}
              >
                M
              </div>

              <span
                className={`text-xl font-bold ${
                  theme ? "text-[#73B88A]" : "text-[#315C45]"
                }`}
              >
                MAZAD
              </span>
            </div>

            <p
              className={`max-w-sm text-sm leading-7 ${
                theme ? "text-[#91A198]" : "text-[#77736C]"
              }`}
            >
              منصة مزاد لبيع وشراء المنتجات من خلال المزادات بطريقة سهلة
              وآمنة.
            </p>
          </div>

          <div>
            <h3
              className={`mb-4 font-bold ${
                theme ? "text-[#E8EEE9]" : "text-[#252525]"
              }`}
            >
              روابط سريعة
            </h3>

            <div
              className={`flex flex-col gap-3 text-sm ${
                theme ? "text-[#91A198]" : "text-[#77736C]"
              }`}
            >
              <Link
                href="/auctions"
                className={`transition-colors ${
                  theme
                    ? "hover:text-[#73B88A]"
                    : "hover:text-[#315C45]"
                }`}
              >
                المزادات
              </Link>

              <Link
                href="/CreateAuction"
                className={`transition-colors ${
                  theme
                    ? "hover:text-[#73B88A]"
                    : "hover:text-[#315C45]"
                }`}
              >
                إنشاء مزاد
              </Link>

              <Link
                href="/profile"
                className={`transition-colors ${
                  theme
                    ? "hover:text-[#73B88A]"
                    : "hover:text-[#315C45]"
                }`}
              >
                الملف الشخصي
              </Link>
            </div>
          </div>

          <div>
            <h3
              className={`mb-4 font-bold ${
                theme ? "text-[#E8EEE9]" : "text-[#252525]"
              }`}
            >
              MAZAD
            </h3>

            <p
              className={`text-sm leading-7 ${
                theme ? "text-[#91A198]" : "text-[#77736C]"
              }`}
            >
              اكتشف المزادات، شارك في المنافسة، واحصل على أفضل العروض.
            </p>
          </div>
        </div>

        <div
          className={`mt-10 flex flex-col gap-3 border-t pt-6 text-center text-sm md:flex-row md:items-center md:justify-between md:text-right ${
            theme
              ? "border-[#26382D] text-[#68776E]"
              : "border-[#E5DED3] text-[#8A867E]"
          }`}
        >
          <p>Auction Platform</p>
        </div>
      </div>
    </footer>
  );
}
