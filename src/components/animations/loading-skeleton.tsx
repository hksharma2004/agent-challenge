"use client"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-800 rounded animate-shimmer" />
          <div className="h-3 bg-gray-800 rounded w-5/6 animate-shimmer" />
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="border border-green-500/20 rounded-lg p-6 space-y-4">
      <div className="h-6 bg-gray-800 rounded w-1/3 animate-shimmer" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded animate-shimmer" />
        <div className="h-4 bg-gray-800 rounded w-5/6 animate-shimmer" />
      </div>
    </div>
  )
}
