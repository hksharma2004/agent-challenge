"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { handleAuthRedirect } from "@/lib/auth";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      const session = await handleAuthRedirect();
      if (session) {
        const redirectTo = searchParams?.get("redirectTo") || "/dashboard";
        router.push(redirectTo);
      }
    };

    handleAuth();
  }, [router, searchParams]);

  const redirectTo = searchParams?.get("redirectTo");
  const githubHref = `/api/auth/github${redirectTo ? `?redirectTo=${redirectTo}` : ""}`;
  const googleHref = `/api/auth/google${redirectTo ? `?redirectTo=${redirectTo}` : ""}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16 md:py-20 animate-slide-up">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8 animate-slide-down">
          <Link href="/landing" className="flex flex-col items-center justify-center">
            <Image
              src="/logo.png"
              alt="DecentraCode Logo"
              width={64}
              height={64}
              className="mb-2"
            />
            <span className="text-2xl font-semibold text-foreground">
              DecentraCode
            </span>
          </Link>
        </div>

        {/* Sign-in Card */}
        <div
          className="border-2 border-[#bcc1ce] bg-white/60 dark:bg-neutral-900/40 rounded-lg p-6 sm:p-8 md:p-10 shadow-lg animate-slide-down"
          style={{ animationDelay: "100ms" }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Sign in to your account to continue
          </p>

          {/* Auth Buttons */}
          <div
            className="grid grid-cols-2 gap-3 animate-slide-down"
            style={{ animationDelay: "350ms" }}
          >
            <a
              href={githubHref}
              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-[#4CAF50] text-foreground py-2 rounded-md transition-all duration-300 font-medium hover:shadow-lg hover:shadow-[#4CAF50]/20 active:scale-[0.98] text-center"
            >
              GitHub
            </a>

            <a
              href={googleHref}
              className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-[#4CAF50] text-foreground py-2 rounded-md transition-all duration-300 font-medium hover:shadow-lg hover:shadow-[#4CAF50]/20 active:scale-[0.98] text-center"
            >
              Google
            </a>
          </div>

          {/* Signup Redirect */}
          <p
            className="text-center text-neutral-600 dark:text-neutral-400 text-sm mt-6 animate-slide-down"
            style={{ animationDelay: "400ms" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#4CAF50] hover:text-[#45a049] font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
