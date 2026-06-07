"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { UserAnalyticsService } from "../../lib/services";

interface Segment {
  label: string;
  percentage: number;
  color: string;
  countText: string;
}

export function SegmentDonut() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    async function loadSegments() {
      try {
        const result = await UserAnalyticsService.getAnalytics();

        const distribution = result.segment_distribution || [];

        let total = 0;

        distribution.forEach((item: any) => {
          total += Number(item.total);
        });

        const mapped: Segment[] = distribution.map((item: any) => {
          const count = Number(item.total);
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          const label = item.persona_label || "UNKNOWN";

          let color = "#b3000d";

          if (label === "PRIORITAS") {
            color = "#d4af37";
          } else if (label === "PENGUSAHA") {
            color = "#0a2540";
          }

          return {
            label,
            percentage,
            color,
            countText: `${count} (${percentage}%)`,
          };
        });

        setSegments(mapped);
        setTotalCount(total);
        setIsLive(true);
      } catch (err) {
        console.error(err);
      }
    }

    loadSegments();
  }, []);

  // SVG parameters
  const size = 180;
  const radius = 65;
  const strokeWidth = 16;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute start offsets for each segment
  let accumulatedPercentage = 0;
  const computedSegments = segments.map((seg, i) => {
    const dashArray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    // SVGs start at 3 o'clock. We rotate -90deg so we start at 12 o'clock.
    const dashOffset = circumference - (accumulatedPercentage / 100) * circumference;
    accumulatedPercentage += seg.percentage;
    return { ...seg, dashArray, dashOffset, i };
  });

  return (
    <Card hoverable={false} className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-slate-800">User Persona Segmentation</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-medium">{isLive ? "Live PostgreSQL segment distribution" : "Distribution by user status"}</CardDescription>
        </div>
        {isLive && <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 animate-pulse">Live DB</span>}
      </CardHeader>
      <CardContent className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Donut graphic */}
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />

            {/* Segment rings */}
            {computedSegments.map((seg) => {
              const isHovered = hoveredIndex === seg.i;
              return (
                <circle
                  key={seg.i}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={seg.dashArray}
                  strokeDashoffset={seg.dashOffset}
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredIndex(seg.i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="transition-all duration-200 cursor-pointer origin-center"
                />
              );
            })}
          </svg>

          {/* Centered label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[80px] truncate">{hoveredIndex !== null ? segments[hoveredIndex].label : isLive ? "Total Nasabah" : "Total"}</span>
            <span className="text-xl font-bold text-slate-800 tracking-tight">
              {hoveredIndex !== null ? (isLive ? `${segments[hoveredIndex].percentage}%` : segments[hoveredIndex].countText) : isLive ? totalCount.toLocaleString() : "100%"}
            </span>
          </div>
        </div>

        {/* Legend listing */}
        <div className="flex-1 flex flex-col gap-2.5 w-full">
          {segments.map((seg, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`flex items-center justify-between p-2 rounded-xl border border-transparent transition-all duration-200 cursor-pointer ${hoveredIndex === i ? "bg-slate-50 border-slate-100" : ""}`}>
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-xs font-semibold text-slate-600">{seg.label}</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{seg.countText}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
