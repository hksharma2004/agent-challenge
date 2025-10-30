"use client"

import { useEffect, useRef, useState } from "react"

export const useCountUp = (target: number, duration = 1000) => {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const range = target
    const increment = target > 0 ? 1 : -1
    const stepTime = Math.abs(Math.floor(duration / range))
    let current = 0

    intervalRef.current = setInterval(() => {
      current += increment
      setCount(current)
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        setCount(target)
        clearInterval(intervalRef.current)
      }
    }, stepTime)

    return () => clearInterval(intervalRef.current)
  }, [target, duration])

  return count
}

export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

export const useHoverLift = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return {
    ref,
    isHovered,
    handlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  }
}
