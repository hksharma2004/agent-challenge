"use client";

import Link from "next/link";
import Image from "next/image";

export function TopNavBar() {
  return (
    <nav className="bg-white shadow-sm transition-all duration-200 ease-out sticky top-0 z-50 h-16 flex items-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="DecentraCode Logo"
            width={28}
            height={28}
            className="w-7 h-7 group-hover:scale-105 transition-transform duration-200 ease-out"
          />
          <span className="text-green-500 font-bold text-lg">DecentraCode</span>
        </Link>
      </div>
    </nav>
  );
}
