"use client"

import type React from "react"
import { useState } from "react"

interface FloatingLabelProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  icon?: React.ReactNode
}

export function FloatingLabel({ label, value, onChange, type = "text", placeholder, icon }: FloatingLabelProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-gray-400">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-gray-900/50 border rounded-lg px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300 ${
            icon ? "pl-10" : ""
          } ${isFocused || value ? "border-green-500/60 shadow-lg shadow-green-500/20" : "border-green-500/30"}`}
        />
        <label
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${icon ? "left-10" : ""} ${
            isFocused || value ? "top-1 text-xs text-green-400 bg-black px-1" : "top-2.5 text-gray-400"
          }`}
        >
          {label}
        </label>
      </div>
    </div>
  )
}
