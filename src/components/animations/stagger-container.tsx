"use client"

import React from "react"

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggerContainer({ children, staggerDelay = 100, className = "" }: StaggerContainerProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div key={index} className="animate-slide-down" style={{ animationDelay: `${index * staggerDelay}ms` }}>
          {child}
        </div>
      ))}
    </div>
  )
}
