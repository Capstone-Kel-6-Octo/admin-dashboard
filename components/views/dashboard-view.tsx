"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Zap, MousePointer } from "lucide-react";
import { StatCard } from "../ui/stat-card";
import { EngagementChart } from "../charts/engagement-chart";
import { DashboardService } from "../../lib/services/dashboard-service";

export function DashboardView() {
  const [totalUsers, setTotalUsers] = useState<string>("124,853");
  const [activeUsers, setActiveUsers] = useState<string>("64,923");
  const [totalFeatureClicks, setTotalFeatureClicks] = useState<string>("32,878");
  const [overallCTR, setOverallCTR] = useState<string>("16.8%");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [engagementData, setEngagementData] = useState<any[]>([]);

  useEffect(() => {
    async function loadLiveStats() {
      setIsLoading(true);

      try {
        const dashboard = await DashboardService.getDashboard();

        setEngagementData(
          (dashboard.engagement_trend || []).map((item: any) => ({
            label: new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            }),
            value: Number(item.total),
          })),
        );

        setTotalUsers(dashboard.summary.total_users.toLocaleString());

        setActiveUsers(dashboard.summary.active_users.toLocaleString());

        setTotalFeatureClicks(dashboard.summary.feature_clicks.toLocaleString());

        setOverallCTR(`${dashboard.summary.ctr}%`);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    loadLiveStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Dashboard & Analytics</h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">Personalization performance overview (Real-Time Live Data)</p>
        </div>
        {isLoading && (
          <span className="text-xs font-bold text-[#b3000d] bg-red-50 border border-red-100 rounded-full px-3 py-1 flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#b3000d] rounded-full" />
            Loading Live Data
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} change="+12.5% vs last month" changeType="positive" icon={<Users className="w-5 h-5 shrink-0" />} iconBgColor="bg-blue-50 text-blue-500" />

        <StatCard title="Active Users" value={activeUsers} change="+8.2% vs last month" changeType="positive" icon={<UserCheck className="w-5 h-5 shrink-0" />} iconBgColor="bg-emerald-50 text-emerald-500" />

        <StatCard title="Total Feature Clicks" value={totalFeatureClicks} change="Real-time interactions" changeType="positive" icon={<Zap className="w-5 h-5 shrink-0" />} iconBgColor="bg-purple-50 text-purple-500" />

        <StatCard title="Overall CTR" value={overallCTR} change="+8.3% vs baseline" changeType="positive" icon={<MousePointer className="w-5 h-5 shrink-0" />} iconBgColor="bg-orange-50 text-orange-500" />
      </div>

      {/* Main Engagement Trend Chart */}
      <div className="w-full">
        <EngagementChart data={engagementData} />
      </div>
    </div>
  );
}
