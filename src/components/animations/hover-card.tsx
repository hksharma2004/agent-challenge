"use client"

import type React from "react"
import { useState } from "react"

interface HoverCardProps {
  children: React.ReactNode
  preview?: React.ReactNode
  className?: string
}

export function HoverCard({ children, preview, className = "" }: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`relative transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {preview && isHovered && (
        <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 border border-green-500/50 rounded-lg text-sm text-gray-300 whitespace-nowrap animate-slide-up z-50">
          {preview}
        </div>
      )}
    </div>
  )
}
