"use client"

import { useEffect, useState } from "react"
import { generateConfetti } from "@/lib/animations"

interface ConfettiProps {
  trigger: boolean
  count?: number
}

export function Confetti({ trigger, count = 50 }: ConfettiProps) {
  const [confetti, setConfetti] = useState<any[]>([])

  useEffect(() => {
    if (trigger) {
      setConfetti(generateConfetti(count))
      const timer = setTimeout(() => setConfetti([]), 3000)
      return () => clearTimeout(timer)
    }
  }, [trigger, count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            top: "-10px",
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}
