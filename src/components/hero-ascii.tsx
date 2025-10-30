"use client"
import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const figlet = require("figlet")

import ansiShadow from "figlet/importable-fonts/ANSI Shadow.js"
import bigFont from "figlet/importable-fonts/Big.js"

type CTA = { label: string; href: string; variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" }
type HeroAsciiProps = {
  text: string
  subtitle?: string
  primary?: CTA
  secondary?: CTA
  font?: string
  className?: string
}

export default function HeroAscii({
  text = "SKILL FORGE",
  subtitle,
  primary,
  secondary,
  font = "ANSI Shadow",
  className,
}: HeroAsciiProps) {
  const [ascii, setAscii] = useState<string>("")

  const fontName = useMemo(() => font || "ANSI Shadow", [font])
  const fontData = useMemo(() => {
    return fontName === "ANSI Shadow" ? ansiShadow : bigFont
  }, [fontName])

  useEffect(() => {
    try {
      figlet.parseFont(fontName, fontData as any)
      figlet.text(
        text,
        {
          font: fontName,
          horizontalLayout: "fitted",
          verticalLayout: "fitted",
          width: 1000, // Increased width to ensure single line
        } as any,
        (err, data) => {
          if (err) {
            console.error("[v0] figlet error:", err)
            setAscii(text)
          } else {
            setAscii(data || text)
          }
        },
      )
    } catch (e) {
      console.error("[v0] figlet parse/render failed:", e)
      setAscii(text)
    }
  }, [text, fontName, fontData])

  return (
    <section className={cn("relative mx-auto max-w-6xl px-4 py-10 text-center", className)}>
      <h1 className="sr-only">{text}</h1>
      <div className="relative mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto inline-block"
          aria-hidden
        >
          {/* FIXED PRE BLOCK WITH RESPONSIVE FONT SIZE */}
          <pre
            className="select-text whitespace-pre font-mono bg-transparent leading-none text-primary"
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "clamp(8px, 1.2vw, 14px)", // scales with screen size
            }}
          >
            {ascii}
          </pre>
        </motion.div>
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-2xl text-muted-foreground"
        >
          {subtitle}
        </motion.p>
      )}

      {(primary || secondary) && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {primary && (
            <motion.a
              href={primary.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button>{primary.label}</Button>
            </motion.a>
          )}
          {secondary && (
            <motion.a
              href={secondary.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button variant={secondary.variant || "secondary"}>{secondary.label}</Button>
            </motion.a>
          )}
        </div>
      )}
    </section>
  )
}
