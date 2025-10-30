"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

interface ToastProps {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const bgColor = {
    success: "bg-green-900/20 border-green-500/50",
    error: "bg-red-900/20 border-red-500/50",
    info: "bg-blue-900/20 border-blue-500/50",
    warning: "bg-yellow-900/20 border-yellow-500/50",
  }[type]

  const textColor = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400",
    warning: "text-yellow-400",
  }[type]

  return (
    <div
      className={`${bgColor} border rounded-lg p-4 flex items-center gap-3 animate-slide-in-right transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${textColor} animate-pulse-dot`} />
      <span className={`${textColor} text-sm font-medium flex-1`}>{message}</span>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(id), 300)
        }}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (message: string, type: ToastProps["type"] = "info", duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration, onClose: removeToast }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
