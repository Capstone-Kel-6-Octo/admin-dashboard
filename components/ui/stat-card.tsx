import React from "react";
import { Card } from "./card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  iconBgColor?: string; // Tailwind class like 'bg-blue-50 text-blue-500'
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  iconBgColor = "bg-slate-50 text-slate-500",
  className = "",
}: StatCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-[#22c55e] font-semibold";
      case "negative":
        return "text-red-500 font-semibold";
      default:
        return "text-slate-400 font-medium";
    }
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${iconBgColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center gap-1 text-xs">
          <span className={getChangeColor()}>
            {change.startsWith("+") || change.startsWith("-") || changeType === "neutral" ? "" : ""}
            {change}
          </span>
        </div>
      )}
    </Card>
  );
}
