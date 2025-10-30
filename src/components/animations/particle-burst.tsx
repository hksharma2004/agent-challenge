"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { generateParticles } from "@/lib/animations"

interface ParticleBurstProps {
  trigger: boolean
  count?: number
  text?: string
}

export function ParticleBurst({ trigger, count = 10, text = "+15 DCC" }: ParticleBurstProps) {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    if (trigger) {
      setParticles(generateParticles(count))
      const timer = setTimeout(() => setParticles([]), 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, count])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-green-400 font-bold animate-particle-burst"
          style={
            {
              left: "50%",
              top: "50%",
              "--tx": `${Math.cos(particle.angle) * particle.distance}px`,
              "--ty": `${Math.sin(particle.angle) * particle.distance}px`,
            } as React.CSSProperties
          }
        >
          {text}
        </div>
      ))}
    </div>
  )
}
