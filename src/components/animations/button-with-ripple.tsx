"use client"

import type React from "react"
import { useState } from "react"

interface ButtonWithRippleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
}

export function ButtonWithRipple({ children, variant = "primary", className = "", ...props }: ButtonWithRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)

    props.onClick?.(e)
  }

  const baseStyles = "relative overflow-hidden transition-all duration-300 active:scale-95 font-medium rounded-lg"
  const variantStyles = {
    primary: "bg-green-500 hover:bg-green-600 text-black hover:shadow-lg hover:shadow-green-500/50",
    secondary: "bg-gray-900/50 hover:bg-gray-800/50 text-white border border-green-500/30 hover:border-green-500/60",
    outline: "border border-green-500/50 hover:border-green-500 text-green-400 hover:text-green-300",
  }

  return (
    <button {...props} onClick={handleClick} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "20px",
            height: "20px",
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.6s ease-out",
          }}
        />
      ))}
    </button>
  )
}
