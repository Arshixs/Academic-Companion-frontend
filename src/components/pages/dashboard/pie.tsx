"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

// Define the interface for chart data
import { DashChartData } from "../dashboard"

// Chart configuration
const chartConfig = {
  present: {
    label: "Present",
    color: "#6f42c1", // Set the color to match the button (adjust if needed)
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

// Single card component
export function AttendanceCard({ className, data }: { className?: string, data: DashChartData })
{
  const attendancePercentage = (data.total_class!=0?Math.round((data.present / data.total_class) * 100):0);
  const endAngle = (data.present / data.total_class) * 360
    console.log("flex flex-col ".concat(className?className:""));
  return (
    <Card className={"flex flex-col ".concat(className?className:"")}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{data.name}</CardTitle> {/* Use the name dynamically */}
        <CardDescription>Total Classes: {data.total_class}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={[data]} 
            startAngle={0}
            endAngle={endAngle} 
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar 
              dataKey="present" 
              background 
              cornerRadius={10} 
              fill={chartConfig.present.color}  // Use the button's purple color here
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {attendancePercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Present
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Attendance is {attendancePercentage}% 
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing attendance record for {data.name}
        </div>
      </CardFooter>
    </Card>
  )
}
