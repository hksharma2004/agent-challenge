"use client"

import { useEffect, useState } from "react"

interface TypingEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export function TypingEffect({ text, speed = 50, onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("")

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}
