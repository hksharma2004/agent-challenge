import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react"; 

const CodeHealthMetricsDisplay: React.FC = () => {

  const mockData = [10, 20, 15, 25, 22, 30, 28];

  const maxVal = Math.max(...mockData);
  const points = mockData
    .map((val, i) => {
      const x = (i / (mockData.length - 1)) * 100;
      const y = 100 - (val / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  // Calculate path length for SVG animation
  const pathLength = mockData.reduce((acc, _, i) => {
    if (i === 0) return 0;
    const p1 = {
      x: ( (i - 1) / (mockData.length - 1) ) * 100,
      y: 100 - (mockData[i - 1] / maxVal) * 100,
    };
    const p2 = {
      x: ( i / (mockData.length - 1) ) * 100,
      y: 100 - (mockData[i] / maxVal) * 100,
    };
    return acc + Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, 0);


  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      {/* Subtle grid/dotted background pattern */}
      <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" style={{
          backgroundImage: `radial-gradient(#e5e7eb 1px, transparent 1px)`,
          backgroundSize: `16px 16px`
        }} />
      </div>

      <Card className={cn("relative z-10 w-full max-w-md rounded-2xl border border-neutral-200 shadow-sm backdrop-blur bg-white/70")}>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-black flex items-center justify-center gap-2">
            95% Score Trend <Sparkles className="h-6 w-6 text-green-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="text-6xl font-bold text-black">95%</div>
          <p className="text-base text-neutral-600 text-center">
            Your codebase is performing well in quality and security metrics.
          </p>
          <div className="w-full h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                points={points}
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength}
                className="animate-line-graph"
              />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeHealthMetricsDisplay;
