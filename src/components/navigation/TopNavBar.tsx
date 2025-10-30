"use client";

import Link from "next/link";
import { Code2, Bell, LogOut, ChevronDown, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function TopNavBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
  };

  const displayName = user?.user_metadata.full_name || "User";
  const displayAvatar =
    user?.user_metadata.avatar_url || "/placeholder-user.jpg";

  return (
    <nav className="bg-white shadow-sm transition-all duration-200 ease-out sticky top-0 z-50 h-16 flex items-center shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="DecentraCode Logo"
            width={28}
            height={28}
            className="w-7 h-7 group-hover:scale-105 transition-transform duration-200 ease-out"
          />
          <span className="text-green-500 font-bold text-lg">DecentraCode</span>
        </div>


        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`relative font-medium text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:translate-y-[-1px] ${
                pathname === "/dashboard" ? "text-black" : ""
              }`}
            >
              Dashboard
              {pathname === "/dashboard" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
            <Link
              href="/dashboard/analyze"
              className={`relative font-medium text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:translate-y-[-1px] ${
                pathname === "/dashboard/analyze" ? "text-black" : ""
              }`}
            >
              Analyze
              {pathname === "/dashboard/analyze" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
            <Link
              href="/reviews"
              className={`relative font-medium text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:translate-y-[-1px] ${
                pathname === "/reviews" ? "text-black" : ""
              }`}
            >
              Reviews
              {pathname === "/reviews" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
            <Link
              href="/credits"
              className={`relative font-medium text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:translate-y-[-1px] ${
                pathname === "/credits" ? "text-black" : ""
              }`}
            >
              Credits
              {pathname === "/credits" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
            <Link
              href="/submissions"
              className={`relative font-medium text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:translate-y-[-1px] ${
                pathname === "/submissions" ? "text-black" : ""
              }`}
            >
              Submissions
              {pathname === "/submissions" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>


        {user && (
          <div className="hidden md:flex items-center gap-3">
            <button className="relative p-1.5 text-neutral-600 hover:text-black transition-all duration-200 ease-out hover:opacity-80 hover:translate-y-[-1px]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-glow" />
            </button>
            <Link href="/profile" className="flex items-center gap-1.5 px-2 py-1 rounded-full group hover:shadow-md transition-all duration-200 ease-out hover:translate-y-[-1px]">
              <Image
                src={displayAvatar}
                alt={displayName}
                width={28}
                height={28}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-black text-sm">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Link>
            <span className="border-l border-neutral-200 pl-4 h-6" />
            <button
              onClick={handleSignOut}
              className="p-1.5 text-neutral-600 hover:text-red-500 transition-all duration-200 ease-out hover:opacity-80 hover:translate-y-[-1px]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}


        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 hover:text-black transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>


        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-out translate-x-0" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-neutral-600 hover:text-black transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  className={`relative font-medium text-neutral-600 hover:text-black transition-colors ${
                    pathname === "/dashboard" ? "text-black" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                  {pathname === "/dashboard" && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </Link>
                <Link
                  href="/dashboard/analyze"
                  className={`relative font-medium text-neutral-600 hover:text-black transition-colors ${
                    pathname === "/dashboard/analyze" ? "text-black" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Analyze
                  {pathname === "/dashboard/analyze" && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </Link>
                <Link
                  href="/reviews"
                  className={`relative font-medium text-neutral-600 hover:text-black transition-colors ${
                    pathname === "/reviews" ? "text-black" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Reviews
                  {pathname === "/reviews" && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </Link>
                <Link
                  href="/credits"
                  className={`relative font-medium text-neutral-600 hover:text-black transition-colors ${
                    pathname === "/credits" ? "text-black" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Credits
                  {pathname === "/credits" && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </Link>
                <Link
                  href="/submissions"
                  className={`relative font-medium text-neutral-600 hover:text-black transition-colors ${
                    pathname === "/submissions" ? "text-black" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Submissions
                  {pathname === "/submissions" && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-green-500 rounded-full" />
                  )}
                </Link>
                {user && (
                  <>
                    <div className="border-t border-neutral-200 my-2" />
                    <Link href="/profile" className="flex items-center gap-2 font-medium text-neutral-600 hover:text-black transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                      <Image
                        src={displayAvatar}
                        alt={displayName}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full"
                      />
                      <span>{displayName}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 font-medium text-neutral-600 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
