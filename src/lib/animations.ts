export const animationConfig = {
  durations: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  easing: {
    easeOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
}

export const countUp = (start: number, end: number, duration = 1000) => {
  return new Promise<void>((resolve) => {
    const range = end - start
    const increment = end > start ? 1 : -1
    const stepTime = Math.abs(Math.floor(duration / range))
    let current = start

    const timer = setInterval(() => {
      current += increment
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end
        clearInterval(timer)
        resolve()
      }
    }, stepTime)
  })
}

export const generateParticles = (count = 10) => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random(),
    angle: Math.random() * Math.PI * 2,
    distance: 50 + Math.random() * 100,
    duration: 0.8 + Math.random() * 0.4,
  }))
}

export const generateConfetti = (count = 50) => {
  return Array.from({ length: count }).map(() => ({
    id: Math.random(),
    left: Math.random() * 100,
    delay: Math.random() * 0.2,
    duration: 2 + Math.random() * 1,
    rotation: Math.random() * 360,
  }))
}
