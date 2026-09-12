"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UseLogout } from "../auth/presentation/hooks/useLogout";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "../them/ThemToggle";
import { UseThemStor } from "@/stor/themStor";

interface NavbarProps {
  userName?: string;
}

export default function Navbar({ userName: initialUserName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState(initialUserName ?? "");

  const router = useRouter();
  const logout = UseLogout();

  const isDark = UseThemStor((state) => state.isDark);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("GET USER ERROR:", error);
        return;
      }

      if (user) {
        setUserName(
          user.user_metadata?.name ||
            user.email ||
            "User"
        );
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setOpen(false);
        router.push("/");
        router.refresh();
      },
    });
  };

  const avatarLetter =
    userName.charAt(0).toUpperCase() || "U";

  const navText = isDark
    ? "text-[#A8B5AD] hover:text-[#73B88A]"
    : "text-gray-600 hover:text-[#315C45]";

  const dropdown = isDark
    ? "border-[#26382D] bg-[#111714] shadow-black/30"
    : "border-gray-200 bg-white shadow-lg";

  const dropdownText = isDark
    ? "text-[#D8E0DB] hover:bg-[#1B2B22]"
    : "text-gray-700 hover:bg-gray-50";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark
          ? "border-[#1F2923] bg-[#050706]/95"
          : "border-gray-200 bg-white/95"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`text-2xl font-black tracking-tight transition ${
              isDark
                ? "text-[#73B88A] hover:text-[#8FD0A2]"
                : "text-[#315C45] hover:text-[#264B38]"
            }`}
          >
            MAZAD
          </Link>

          <div className="hidden items-center gap-7 md:flex">

            <Link
              href="/auctions"
              className={`text-sm font-semibold transition ${navText}`}
            >
              الرئيسية
            </Link>

            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm font-semibold transition ${navText}`}
              >
                مزاداتي

                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              <div
                className={`invisible absolute right-0 top-full mt-3 w-64 translate-y-2 overflow-hidden rounded-2xl border opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${dropdown}`}
              >
                <Link
                  href="/my-auctions/unpaid"
                  className={`block px-4 py-4 transition ${dropdownText}`}
                >
                  <div className="text-sm font-bold">
                    المنتهية — الفائز لم يدفع
                  </div>

                  <div
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-gray-500"
                    }`}
                  >
                    المزادات التي انتهت ولم يتم الدفع
                  </div>
                </Link>

                <Link
                  href="/my-auctions/paid"
                  className={`block border-t px-4 py-4 transition ${
                    isDark
                      ? "border-[#26382D]"
                      : "border-gray-100"
                  } ${dropdownText}`}
                >
                  <div className="text-sm font-bold">
                    المنتهية — الفائز دفع
                  </div>

                  <div
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-gray-500"
                    }`}
                  >
                    المزادات التي انتهت وتم الدفع
                  </div>
                </Link>
              </div>
            </div>

            <div className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1.5 text-sm font-semibold transition ${navText}`}
              >
                مشترياتي

                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              <div
                className={`invisible absolute right-0 top-full mt-3 w-64 translate-y-2 overflow-hidden rounded-2xl border opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${dropdown}`}
              >
                <Link
                  href="/my-purchases/unpaid"
                  className={`block px-4 py-4 transition ${dropdownText}`}
                >
                  <div className="text-sm font-bold">
                    اشتريتها — لم أدفع
                  </div>

                  <div
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-gray-500"
                    }`}
                  >
                    المزادات التي فزت بها ولم أدفع
                  </div>
                </Link>

                <Link
                  href="/my-purchases/paid"
                  className={`block border-t px-4 py-4 transition ${
                    isDark
                      ? "border-[#26382D]"
                      : "border-gray-100"
                  } ${dropdownText}`}
                >
                  <div className="text-sm font-bold">
                    اشتريتها — دفعت
                  </div>

                  <div
                    className={`mt-1 text-xs ${
                      isDark
                        ? "text-[#91A198]"
                        : "text-gray-500"
                    }`}
                  >
                    المزادات التي فزت بها وتم الدفع
                  </div>
                </Link>
              </div>
            </div>

            <Link
              href="/CreateAuction"
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                isDark
                  ? "bg-[#1B2B22] text-[#73B88A] hover:bg-[#263D30]"
                  : "bg-[#F1F5F2] text-[#315C45] hover:bg-[#E5ECE7]"
              }`}
            >
              إنشاء مزاد
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                isDark
                  ? "hover:bg-[#111714]"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315C45] text-sm font-bold text-white shadow-sm">
                {avatarLetter}
              </div>

              <div className="min-w-0 text-right">
                <p
                  className={`max-w-28 truncate text-sm font-bold ${
                    isDark
                      ? "text-[#E8EEE9]"
                      : "text-gray-800"
                  }`}
                >
                  {userName || "User"}
                </p>

                <p
                  className={`text-xs ${
                    isDark
                      ? "text-[#91A198]"
                      : "text-gray-500"
                  }`}
                >
                  حسابي
                </p>
              </div>

              <svg
                className={`h-4 w-4 transition ${
                  isDark
                    ? "text-[#91A198]"
                    : "text-gray-500"
                } ${open ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {open && (
              <div
                className={`absolute left-0 mt-3 w-56 overflow-hidden rounded-2xl border shadow-xl ${dropdown}`}
              >
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 text-sm font-medium transition ${dropdownText}`}
                >
                  <span>👤</span>
                  <span>الصفحة الشخصية</span>
                </Link>

                <div
                  className={`border-t ${
                    isDark
                      ? "border-[#26382D]"
                      : "border-gray-100"
                  }`}
                />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className={`flex w-full items-center gap-3 px-4 py-4 text-sm font-medium transition disabled:opacity-50 ${
                    isDark
                      ? "text-[#D47777] hover:bg-[#241819]"
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <span>↪</span>

                  <span>
                    {logout.isPending
                      ? "جاري تسجيل الخروج..."
                      : "تسجيل الخروج"}
                  </span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition md:hidden ${
              isDark
                ? "border-[#26382D] bg-[#111714] text-[#D8E0DB] hover:bg-[#1B2B22]"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            aria-label="فتح القائمة"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          className={`border-t md:hidden ${
            isDark
              ? "border-[#1F2923] bg-[#090B0A]"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="space-y-1 px-4 py-4">

            <Link
              href="/auctions"
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isDark
                  ? "text-[#D8E0DB] hover:bg-[#111714]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              الرئيسية
            </Link>

            <div
              className={`my-2 rounded-xl p-2 ${
                isDark
                  ? "bg-[#0F1511]"
                  : "bg-gray-50"
              }`}
            >
              <p
                className={`px-3 py-2 text-sm font-bold ${
                  isDark
                    ? "text-[#73B88A]"
                    : "text-[#315C45]"
                }`}
              >
                مزاداتي
              </p>

              <Link
                href="/my-auctions/unpaid"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  isDark
                    ? "text-[#A8B5AD] hover:bg-[#1B2B22]"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                المنتهية — الفائز لم يدفع
              </Link>

              <Link
                href="/my-auctions/paid"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  isDark
                    ? "text-[#A8B5AD] hover:bg-[#1B2B22]"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                المنتهية — الفائز دفع
              </Link>
            </div>

            <div
              className={`my-2 rounded-xl p-2 ${
                isDark
                  ? "bg-[#0F1511]"
                  : "bg-gray-50"
              }`}
            >
              <p
                className={`px-3 py-2 text-sm font-bold ${
                  isDark
                    ? "text-[#73B88A]"
                    : "text-[#315C45]"
                }`}
              >
                مشترياتي
              </p>

              <Link
                href="/my-purchases/unpaid"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  isDark
                    ? "text-[#A8B5AD] hover:bg-[#1B2B22]"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                اشتريتها — لم أدفع
              </Link>

              <Link
                href="/my-purchases/paid"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  isDark
                    ? "text-[#A8B5AD] hover:bg-[#1B2B22]"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                اشتريتها — دفعت
              </Link>
            </div>

            <Link
              href="/CreateAuction"
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-bold transition ${
                isDark
                  ? "bg-[#1B2B22] text-[#73B88A] hover:bg-[#263D30]"
                  : "bg-[#F1F5F2] text-[#315C45] hover:bg-[#E5ECE7]"
              }`}
            >
              إنشاء مزاد
            </Link>

            <div
              className={`my-3 border-t ${
                isDark
                  ? "border-[#26382D]"
                  : "border-gray-100"
              }`}
            />

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isDark
                  ? "text-[#D8E0DB] hover:bg-[#111714]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              👤 الصفحة الشخصية
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={logout.isPending}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                isDark
                  ? "text-[#D47777] hover:bg-[#241819]"
                  : "text-red-600 hover:bg-red-50"
              }`}
            >
              <span>↪</span>

              <span>
                {logout.isPending
                  ? "جاري تسجيل الخروج..."
                  : "تسجيل الخروج"}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
