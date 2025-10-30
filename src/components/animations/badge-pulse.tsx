"use client"

interface BadgePulseProps {
  count: number
  label?: string
}

export function BadgePulse({ count, label }: BadgePulseProps) {
  return (
    <div className="relative inline-block">
      <div className="absolute -top-2 -right-2 animate-pulse-glow">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-black bg-green-400 rounded-full">
          {count}
        </span>
      </div>
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </div>
  )
}
