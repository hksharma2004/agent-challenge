import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  className?: string;
  indicatorColor?: string; 
}

export function ProgressBar({ value, maxValue = 100, className, indicatorColor = "bg-neon-green" }: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out", indicatorColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
