"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
const codeHealthData = [
  { month: 'Jan', quality: 62, vulnerabilities: 45 },
  { month: 'Feb', quality: 68, vulnerabilities: 38 },
  { month: 'Mar', quality: 66, vulnerabilities: 35 },
  { month: 'Apr', quality: 72, vulnerabilities: 28 },
  { month: 'May', quality: 70, vulnerabilities: 22 },
  { month: 'Jun', quality: 78, vulnerabilities: 18 },
];

const chartConfig = {
  quality: {
    label: "Average Code Quality Score",
    color: "var(--chart-1)", // Orange - Solid
  },
  vulnerabilities: {
    label: "Security Vulnerabilities Detected",
    color: "var(--chart-2)", // Blue - Dashed
  },
} satisfies ChartConfig;

export function DottedMultiLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Quality vs. Security Issues Over Time ⭐ BEST FIT</CardTitle>
        <CardDescription>January - June</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={codeHealthData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="quality"
              type="linear"
              stroke="var(--color-quality)"
              dot={false}
            />
            <Line
              dataKey="vulnerabilities"
              type="linear"
              stroke="var(--color-vulnerabilities)"
              dot={false}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
