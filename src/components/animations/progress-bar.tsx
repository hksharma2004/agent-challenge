"use client"

import { useEffect, useState } from "react"

interface ProgressBarProps {
  progress: number
  duration?: number
  showLabel?: boolean
}

export function ProgressBar({ progress, duration = 1000, showLabel = true }: ProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * progress, progress)
      setDisplayProgress(newProgress)

      if (newProgress >= progress) {
        clearInterval(interval)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [progress, duration])

  return (
    <div className="w-full">
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 rounded-full"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-gray-400 mt-2">{Math.round(displayProgress)}%</p>}
    </div>
  )
}
