"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

interface ConversionPoint {
  label: string;
  before: number;
  after: number;
}

interface ConversionChartProps {
  data: ConversionPoint[];
}

export function ConversionChart({ data }: ConversionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data.length) {
    return (
      <Card hoverable={false} className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">A/B Test: Conversion Rate Before vs After</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">Comparing baseline performance with AI personalization</CardDescription>
        </CardHeader>

        <CardContent className="h-[320px] flex items-center justify-center text-slate-400 text-sm">No trend data available</CardContent>
      </Card>
    );
  }

  const width = 800;
  const height = 260;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.flatMap((d) => [d.before, d.after])) * 1.2;

  const minVal = 0;

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * chartWidth;

    const yBefore = paddingTop + chartHeight - ((d.before - minVal) / (maxVal - minVal)) * chartHeight;

    const yAfter = paddingTop + chartHeight - ((d.after - minVal) / (maxVal - minVal)) * chartHeight;

    return {
      x,
      yBefore,
      yAfter,
      ...d,
      index,
    };
  });

  let beforeD = "";
  let afterD = "";

  if (points.length > 0) {
    beforeD = `M ${points[0].x} ${points[0].yBefore}`;
    afterD = `M ${points[0].x} ${points[0].yAfter}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];

      const cpX = chartWidth / Math.max(data.length - 1, 1) / 3;

      beforeD += ` C ${curr.x + cpX} ${curr.yBefore},
      ${next.x - cpX} ${next.yBefore},
      ${next.x} ${next.yBefore}`;

      afterD += ` C ${curr.x + cpX} ${curr.yAfter},
      ${next.x - cpX} ${next.yAfter},
      ${next.x} ${next.yAfter}`;
    }
  }

  const tickCount = 5;

  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => Math.round((maxVal / tickCount) * i));

  return (
    <Card hoverable={false} className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">A/B Test: Conversion Rate Before vs After</CardTitle>

        <CardDescription className="text-xs text-slate-400 font-medium">Comparing baseline performance with AI personalization</CardDescription>
      </CardHeader>

      <CardContent className="mt-4">
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[9px] font-bold text-slate-400 select-none uppercase tracking-widest">CTR (%)</div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none pl-3">
            {yTicks.map((tick) => {
              const y = paddingTop + chartHeight - ((tick - minVal) / (maxVal - minVal)) * chartHeight;

              return (
                <g key={tick} className="opacity-40">
                  <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

                  <text x={paddingLeft - 12} y={y + 4} textAnchor="end" className="text-[10px] font-semibold fill-slate-400">
                    {tick}
                  </text>
                </g>
              );
            })}

            {points.map((p, i) => (
              <text key={i} x={p.x} y={height - 24} textAnchor="middle" className="text-[11px] font-semibold fill-slate-400">
                {p.label}
              </text>
            ))}

            <path d={beforeD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            <path d={afterD} fill="none" stroke="#b3000d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {hoveredIndex !== null && <line x1={points[hoveredIndex].x} y1={paddingTop} x2={points[hoveredIndex].x} y2={paddingTop + chartHeight} stroke="#64748b" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 2" />}

            {points.map((p, i) => (
              <circle key={`before-${i}`} cx={p.x} cy={p.yBefore} r={hoveredIndex === i ? 5 : 3.5} fill="#fff" stroke="#3b82f6" strokeWidth={2} />
            ))}

            {points.map((p, i) => (
              <circle key={`after-${i}`} cx={p.x} cy={p.yAfter} r={hoveredIndex === i ? 5 : 3.5} fill="#fff" stroke="#b3000d" strokeWidth={2} />
            ))}

            {points.map((p, i) => (
              <rect
                key={i}
                x={p.x - chartWidth / Math.max(data.length - 1, 1) / 2}
                y={paddingTop}
                width={chartWidth / Math.max(data.length - 1, 1)}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              />
            ))}
          </svg>

          {hoveredIndex !== null && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl p-3 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full text-[11px] font-bold"
              style={{
                left: `${((points[hoveredIndex].x - paddingLeft) / chartWidth) * 100}%`,
                top: `${((points[hoveredIndex].yBefore + points[hoveredIndex].yAfter) / 2 / height) * 100}%`,
                marginTop: "-20px",
              }}>
              <div className="text-slate-400 mb-1">{points[hoveredIndex].label}</div>

              <div>Before: {points[hoveredIndex].before.toFixed(2)}%</div>

              <div>After: {points[hoveredIndex].after.toFixed(2)}%</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-4 h-[2px] bg-blue-500" />
            <span className="text-xs font-semibold text-slate-500">Before Personalization</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-[2px] bg-[#b3000d]" />
            <span className="text-xs font-semibold text-slate-500">After Personalization</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
