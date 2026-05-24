"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

interface ConversionPoint {
  label: string;
  before: number;
  after: number;
}

const data: ConversionPoint[] = [
  { label: "Jan", before: 2.4, after: 4.8 },
  { label: "Feb", before: 2.6, after: 5.2 },
  { label: "Mar", before: 2.5, after: 5.0 },
  { label: "Apr", before: 2.7, after: 5.4 },
  { label: "May", before: 2.8, after: 5.6 },
  { label: "Jun", before: 2.6, after: 5.8 },
];

export function ConversionChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 260;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVal = 0;
  const maxVal = 7;

  // Map to SVG coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const yBefore = paddingTop + chartHeight - ((d.before - minVal) / (maxVal - minVal)) * chartHeight;
    const yAfter = paddingTop + chartHeight - ((d.after - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, yBefore, yAfter, ...d, index };
  });

  // Curved line generator for before path
  let beforeD = "";
  let afterD = "";
  if (points.length > 0) {
    beforeD = `M ${points[0].x} ${points[0].yBefore}`;
    afterD = `M ${points[0].x} ${points[0].yAfter}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX = chartWidth / (data.length - 1) / 3;

      beforeD += ` C ${curr.x + cpX} ${curr.yBefore}, ${next.x - cpX} ${next.yBefore}, ${next.x} ${next.yBefore}`;
      afterD += ` C ${curr.x + cpX} ${curr.yAfter}, ${next.x - cpX} ${next.yAfter}, ${next.x} ${next.yAfter}`;
    }
  }

  const yTicks = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <Card hoverable={false} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">
          A/B Test: Conversion Rate Before vs After
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 font-medium">
          Comparing baseline performance with AI personalization
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="relative w-full overflow-hidden">
          {/* Label indicating Y axis */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[9px] font-bold text-slate-400 select-none uppercase tracking-widest">
            Conversion Rate (%)
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none pl-3"
          >
            {/* Gridlines */}
            {yTicks.map((tick) => {
              const y = paddingTop + chartHeight - ((tick - minVal) / (maxVal - minVal)) * chartHeight;
              return (
                <g key={tick} className="opacity-40">
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 12}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-semibold fill-slate-400"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 24}
                textAnchor="middle"
                className="text-[11px] font-semibold fill-slate-400"
              >
                {p.label}
              </text>
            ))}

            {/* Before Personalization Curve (Blue) */}
            <path
              d={beforeD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* After Personalization Curve (Red) */}
            <path
              d={afterD}
              fill="none"
              stroke="#b3000d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hover Guide line */}
            {hoveredIndex !== null && (
              <line
                x1={points[hoveredIndex].x}
                y1={paddingTop}
                x2={points[hoveredIndex].x}
                y2={paddingTop + chartHeight}
                stroke="#64748b"
                strokeWidth="1"
                strokeOpacity="0.25"
                strokeDasharray="2 2"
              />
            )}

            {/* Before (Blue) dots */}
            {points.map((p, i) => (
              <circle
                key={`b-${i}`}
                cx={p.x}
                cy={p.yBefore}
                r={hoveredIndex === i ? 5.5 : 3.5}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={hoveredIndex === i ? 3 : 2}
                className="transition-all duration-150"
              />
            ))}

            {/* After (Red) dots */}
            {points.map((p, i) => (
              <circle
                key={`a-${i}`}
                cx={p.x}
                cy={p.yAfter}
                r={hoveredIndex === i ? 5.5 : 3.5}
                fill="#ffffff"
                stroke="#b3000d"
                strokeWidth={hoveredIndex === i ? 3 : 2}
                className="transition-all duration-150"
              />
            ))}

            {/* Hover triggers */}
            {points.map((p, i) => (
              <rect
                key={`trigger-${i}`}
                x={p.x - chartWidth / (data.length - 1) / 2}
                y={paddingTop}
                width={chartWidth / (data.length - 1)}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>

          {/* HTML dynamic tooltip container */}
          {hoveredIndex !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl p-3 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full text-[11px] font-bold tracking-wide transition-all duration-200"
              style={{
                left: `${((points[hoveredIndex].x - paddingLeft) / chartWidth) * 100}%`,
                top: `${((points[hoveredIndex].yAfter + points[hoveredIndex].yBefore) / 2 / height) * 100}%`,
                marginTop: "-20px",
              }}
            >
              <div className="text-slate-400 font-semibold mb-1 text-center">{points[hoveredIndex].label}</div>
              <div className="flex gap-4 items-center justify-between text-left">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#b3000d] mr-1"></span>
                  <span className="text-slate-400 font-medium">After:</span>
                </div>
                <div className="text-white text-xs">{points[hoveredIndex].after.toFixed(1)}%</div>
              </div>
              <div className="flex gap-4 items-center justify-between text-left mt-0.5">
                <div>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#3b82f6] mr-1"></span>
                  <span className="text-slate-400 font-medium">Before:</span>
                </div>
                <div className="text-white text-xs">{points[hoveredIndex].before.toFixed(1)}%</div>
              </div>
            </div>
          )}
        </div>

        {/* Legend container */}
        <div className="flex items-center justify-center gap-6 mt-4 pb-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-3.5 h-1 border-t-2 border-[#3b82f6] relative items-center justify-center">
              <span className="absolute w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Before Personalization
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex w-3.5 h-1 border-t-2 border-[#b3000d] relative items-center justify-center">
              <span className="absolute w-1.5 h-1.5 rounded-full bg-[#b3000d]" />
            </span>
            <span className="text-xs font-semibold text-slate-500">
              After Personalization
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
