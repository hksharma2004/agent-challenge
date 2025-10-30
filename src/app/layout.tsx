import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster";

import localFont from 'next/font/local';

const decentracodeFont = localFont({
  src: '../../public/Geist-VariableFont_wght.ttf', 
  variable: '--font-decentracode',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: "DecentraCode - Code Review Platform",
  description: "AI-powered code review and credit-based economy",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${decentracodeFont.variable}`}>
      <body className={`font-decentracode antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
