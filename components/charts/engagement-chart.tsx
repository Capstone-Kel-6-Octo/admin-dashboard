"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface EngagementChartProps {
  data: ChartDataPoint[];
}

export function EngagementChart({ data }: EngagementChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <Card hoverable={false} className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">Overall App Engagement Trend</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">Total interactions over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No engagement data available</div>
        </CardContent>
      </Card>
    );
  }

  const width = 800;
  const height = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVal = 0;
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.2;

  const points = data.map((d, index) => {
    const x = data.length === 1 ? width / 2 : paddingLeft + (index / (data.length - 1)) * chartWidth;

    const y = paddingTop + chartHeight - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;

    return { x, y, ...d, index };
  });

  let pathD = "";

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      const cpX1 = curr.x + chartWidth / Math.max(data.length - 1, 1) / 3;
      const cpY1 = curr.y;

      const cpX2 = next.x - chartWidth / Math.max(data.length - 1, 1) / 3;
      const cpY2 = next.y;

      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }
  }

  const yTicks = [Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), Math.round(maxVal)];

  return (
    <Card hoverable={false} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">Overall App Engagement Trend</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">Total interactions over time</CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
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

            {points.map((p, i) => (
              <text key={i} x={p.x} y={height - 8} textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">
                {p.label}
              </text>
            ))}

            <defs>
              <linearGradient id="engagement-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b3000d" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#b3000d" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={`${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`} fill="url(#engagement-gradient)" />

            <path d={pathD} fill="none" stroke="#b3000d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {hoveredIndex !== null && <line x1={points[hoveredIndex].x} y1={paddingTop} x2={points[hoveredIndex].x} y2={paddingTop + chartHeight} stroke="#b3000d" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="2 2" />}

            {points.map((p, i) => (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} className="cursor-pointer">
                <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 6 : 4} fill="#ffffff" stroke="#b3000d" strokeWidth={hoveredIndex === i ? 3 : 2} className="transition-all duration-150" />

                <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
              </g>
            ))}
          </svg>

          {hoveredIndex !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full text-[11px] font-bold tracking-wide"
              style={{
                left: `${((points[hoveredIndex].x - paddingLeft) / chartWidth) * 100}%`,
                top: `${(points[hoveredIndex].y / height) * 100}%`,
                marginTop: "-16px",
              }}>
              <div className="text-slate-400 font-semibold mb-0.5">{points[hoveredIndex].label}</div>

              <div className="text-white text-xs">{points[hoveredIndex].value.toLocaleString()}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
