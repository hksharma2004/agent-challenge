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

export function NumberDotLineChart() {
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
              cursorStyle={{}}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="quality"
              type="linear"
              stroke="var(--color-quality)"
              dot={<CustomizedDot />}
              activeDot={() => <></>}
            />
            <Line
              dataKey="vulnerabilities"
              type="linear"
              stroke="var(--color-vulnerabilities)"
              dot={<CustomizedDot />}
              strokeDasharray="4 4"
              activeDot={() => <></>}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const CustomizedDot = (
  props: React.SVGProps<SVGCircleElement> & { value?: number }
) => {
  const { cx, cy, stroke, value } = props;

  return (
    <g>
      {/* Main dot */}
      <circle cx={cx} cy={cy} r={9} fill={stroke} />
      <text
        className="dark:text-black text-white"
        x={cx}
        y={cy}
        textAnchor="middle"
        dy={8}
        fontSize={8}
        fontWeight={600}
        fill="currentColor"
        transform="translate(0, -5)"
      >
        {value?.toString()}
      </text>
    </g>
  );
};
