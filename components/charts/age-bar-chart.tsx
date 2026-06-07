"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { UserAnalyticsService } from "../../lib/services";

interface AgeGroup {
  label: string;
  value: number;
}

const defaultData: AgeGroup[] = [
  { label: "18-25", value: 0 },
  { label: "26-35", value: 0 },
  { label: "36-45", value: 0 },
  { label: "46-55", value: 0 },
  { label: "56+", value: 0 },
];

export function AgeBarChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [data, setData] = useState<AgeGroup[]>(defaultData);

  useEffect(() => {
    async function loadAgeDistribution() {
      try {
        const result = await UserAnalyticsService.getAnalytics();

        const ages = result.age_distribution || [];

        if (ages.length === 0) {
          setData(defaultData);
          return;
        }

        const mapped = ages.map((item: any) => ({
          label: item.age_group,
          value: Number(item.total),
        }));

        setData(mapped);
      } catch (err) {
        console.error(err);
      }
    }

    loadAgeDistribution();
  }, []);

  // SVG parameters
  const width = 500;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVal = 0;
  const maxVal = Math.max(...data.map((d) => d.value), 10);

  const yTicks = [0, 15000, 30000, 45000, 60000];

  // Bar spacing
  const barGap = 20;
  const totalBarSpacing = barGap * (data.length - 1);
  const barWidth = (chartWidth - totalBarSpacing) / data.length;

  return (
    <Card hoverable={false} className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-800">Age Distribution</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">Users by age group</CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Gridlines */}
            {yTicks.map((tick, i) => {
              const y = paddingTop + chartHeight - ((tick - minVal) / (maxVal - minVal)) * chartHeight;
              return (
                <g key={i} className="opacity-40">
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                  <text x={paddingLeft - 12} y={y + 4} textAnchor="end" className="text-[10px] font-semibold fill-slate-400">
                    {tick.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Columns (Bars) */}
            {data.map((item, i) => {
              const barHeight = ((item.value - minVal) / (maxVal - minVal)) * chartHeight;
              const x = paddingLeft + i * (barWidth + barGap);
              const y = paddingTop + chartHeight - barHeight;
              const isHovered = hoveredIndex === i;

              return (
                <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                  {/* Rounded-top column using SVG path */}
                  <path
                    d={`
                      M ${x} ${paddingTop + chartHeight}
                      L ${x} ${y + 6}
                      Q ${x} ${y} ${x + 6} ${y}
                      L ${x + barWidth - 6} ${y}
                      Q ${x + barWidth} ${y} ${x + barWidth} ${y + 6}
                      L ${x + barWidth} ${paddingTop + chartHeight}
                      Z
                    `}
                    fill={isHovered ? "#91000a" : "#b3000d"}
                    className="transition-all duration-200"
                  />

                  {/* Label for groups below the bars */}
                  <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">
                    {item.label}
                  </text>

                  {/* Large overlay trigger box */}
                  <rect x={x} y={paddingTop} width={barWidth} height={chartHeight} fill="transparent" />
                </g>
              );
            })}
          </svg>

          {/* HTML dynamic tooltip container */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full text-[11px] font-bold tracking-wide transition-all duration-200"
              style={{
                left: `${((paddingLeft + hoveredIndex * (barWidth + barGap) + barWidth / 2 - paddingLeft) / chartWidth) * 100}%`,
                top: `${((paddingTop + chartHeight - ((data[hoveredIndex].value - minVal) / (maxVal - minVal)) * chartHeight) / height) * 100}%`,
                marginTop: "-12px",
              }}>
              <div className="text-slate-400 font-semibold mb-0.5">{data[hoveredIndex].label}</div>
              <div className="text-white text-xs">{data[hoveredIndex].value.toLocaleString()} users</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
