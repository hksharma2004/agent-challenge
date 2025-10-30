"use client"

import { useEffect, useState } from "react"

interface NumberTickerProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function NumberTicker({ value, duration = 1000, prefix = "", suffix = "" }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayValue(Math.floor(progress * value))

      if (progress >= 1) {
        clearInterval(interval)
        setDisplayValue(value)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [value, duration])

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
