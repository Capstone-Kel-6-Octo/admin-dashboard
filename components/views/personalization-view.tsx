"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, BarChart2, TrendingUp, Cpu, RefreshCw } from "lucide-react";
import { StatCard } from "../ui/stat-card";
import { ConversionChart } from "../charts/conversion-chart";
import { PersonalizationService } from "../../lib/services/personalization-service";

export function PersonalizationView() {
  const [ctr, setCtr] = useState<string>("0%");
  const [uplift, setUplift] = useState<string>("0%");
  const [groupAUsers, setGroupAUsers] = useState<number>(0);
  const [groupBUsers, setGroupBUsers] = useState<number>(0);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const analytics = await PersonalizationService.getAnalytics();

      setCtr(`${analytics.after_ctr}%`);

      setUplift(`${analytics.improvement}%`);

      setGroupAUsers(analytics.summary.group_a_users);

      setGroupBUsers(analytics.summary.group_b_users);

      setTrendData(
        analytics.trend.map((item: any) => ({
          label: new Date(item.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          }),
          before: Number(item.before),
          after: Number(item.after),
        })),
      );
    } catch (e) {
      console.warn("Gagal memuat analitik personalisasi.", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Personalization Analytics</h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">A/B Test results and recommendation performance (Real-Time A/B Engine)</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isLoading && (
            <span className="text-[10px] font-bold text-[#b3000d] bg-red-50 border border-red-100 rounded-full px-2.5 py-1 flex items-center gap-1.5 animate-pulse">
              <span className="w-1 h-1 bg-[#b3000d] rounded-full" />
              Loading Engine
            </span>
          )}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm shrink-0">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#b3000d]" : ""}`} />
            Sync CTR
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Avg Conversion Uplift" value={uplift} change="AI vs Baseline Control" changeType="positive" icon={<TrendingUp className="w-5 h-5 shrink-0" />} iconBgColor="bg-emerald-50 text-[#10b981]" />

        <StatCard title="A/B Test Status" value="Active" change={`${groupAUsers + groupBUsers} experiment participants`} changeType="neutral" icon={<Sparkles className="w-5 h-5 shrink-0" />} iconBgColor="bg-blue-50 text-blue-500" />

        <StatCard title="Recommendation Engine" value="OCTO-AI v2" change={`Group A: ${groupAUsers} | Group B: ${groupBUsers}`} changeType="neutral" icon={<Cpu className="w-5 h-5 shrink-0" />} iconBgColor="bg-purple-50 text-purple-500" />

        <StatCard title="Personalized CTR" value={ctr} change="+12.4% vs last month" changeType="positive" icon={<BarChart2 className="w-5 h-5 shrink-0" />} iconBgColor="bg-orange-50 text-orange-500" />
      </div>

      {/* Chart and Banner Section */}
      <div className="space-y-6">
        <ConversionChart data={trendData} />

        {/* High-Fidelity Green Improvement Banner */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Average Improvement</h4>
            <p className="text-xs font-semibold text-emerald-700/80 leading-normal">
              Personalization increased conversion by an average of <strong className="text-emerald-800">{uplift}</strong> across all segments
            </p>
          </div>
          <div className="text-4xl font-extrabold text-[#10b981] tracking-tight leading-none">{uplift}</div>
        </div>
      </div>
    </div>
  );
}
