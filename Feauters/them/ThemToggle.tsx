"use client";

import { UseThemStor } from "@/stor/themStor";

export default function ThemeToggle() {
  const isDark = UseThemStor((state) => state.isDark);
  const toggleTheme = UseThemStor((state) => state.Toggle);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغيير المظهر"
      className={`group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 ${
        isDark
          ? "border-[#26382D] bg-[#111714] text-[#FACC15] hover:border-[#4E8063] hover:bg-[#1B2B22]"
          : "border-[#E3E0D8] bg-white text-[#315C45] hover:border-[#315C45] hover:bg-[#F5F3EE]"
      }`}
    >
      <span
        className={`text-xl transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100"
            : "rotate-[-20deg] scale-100"
        }`}
      >
        {isDark ? "☀️" : "🌙"}
      </span>

      <span
        className={`absolute inset-0 rounded-xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-[#4E8063]/20`}
      />
    </button>
  );
}
