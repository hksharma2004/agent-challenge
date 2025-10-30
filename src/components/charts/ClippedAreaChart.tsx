"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react"; // Changed to TrendingUp
import { useRef, useState } from "react";
import { useSpring, useMotionValueEvent } from "framer-motion";
import { mockRootProps } from "@/data/decentracodeMockData"; // Import mockRootProps

const chartData = mockRootProps.codeQualityData; // Use codeQualityData

const chartConfig = {
  score: { // Changed to score
    label: "Code Quality",
    color: "#FCA070",
  },
} satisfies ChartConfig;

export function ClippedAreaChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [axis, setAxis] = useState(0);

  // motion values
  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  });
  const springY = useSpring(95, {
    damping: 30,
    stiffness: 100,
  });

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {springY.get().toFixed(0)}% {/* Changed to percentage */}
          <Badge variant="secondary" className="ml-2">
            <TrendingUp className="h-4 w-4" /> {/* Changed to TrendingUp */}
            <span>+5.2%</span> {/* Changed to positive percentage */}
          </Badge>
        </CardTitle>
        <CardDescription>Code quality score for last year</CardDescription> {/* Updated description */}
      </CardHeader>
      <CardContent>
        <ChartContainer
          ref={chartRef}
          className="h-54 w-full"
          config={chartConfig}
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={chartData}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue = state.activePayload?.[0]?.value;
              if (x && dataValue !== undefined) {
                springX.set(x);
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              springX.set(chartRef.current?.getBoundingClientRect().width || 0);
              springY.jump(chartData[chartData.length - 1].score); // Changed to score
            }}
            margin={{
              right: 0,
              left: 0,
            }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              horizontalCoordinatesGenerator={(props) => {
                const { height } = props;
                return [0, height - 30];
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Area
              dataKey="score" 
              type="monotone"
              fill="url(#gradient-cliped-area-score)" 
              fillOpacity={0.4}
              stroke="var(--color-score)" 
              clipPath={`inset(0 ${
                Number(chartRef.current?.getBoundingClientRect().width) - axis
              } 0 0)`}
            />
            <line
              x1={axis}
              y1={0}
              x2={axis}
              y2={"85%"}
              stroke="var(--color-score)" // Changed variable
              strokeDasharray="3 3"
              strokeLinecap="round"
              strokeOpacity={0.2}
            />
            <rect
              x={axis - 50}
              y={0}
              width={50}
              height={18}
              fill="var(--color-score)" // Changed variable
            />
            <text
              x={axis - 25}
              fontWeight={600}
              y={13}
              textAnchor="middle"
              fill="var(--primary-foreground)"
            >
              {springY.get().toFixed(0)}% {/* Changed to percentage */}
            </text>
            {/* this is a ghost line behind graph */}
            <Area
              dataKey="score" // Changed to score
              type="monotone"
              fill="none"
              stroke="var(--color-score)" // Changed variable
              strokeOpacity={0.1}
            />
            <defs>
              <linearGradient
                id="gradient-cliped-area-score" // Changed ID
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-score)" // Changed variable
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-score)" // Changed variable
                  stopOpacity={0}
                />
                <mask id="mask-cliped-area-chart">
                  <rect
                    x={0}
                    y={0}
                    width={"50%"}
                    height={"100%"}
                    fill="white"
                  />
                </mask>
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
