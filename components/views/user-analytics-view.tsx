"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserPlus, UserX, RefreshCw } from "lucide-react";
import { StatCard } from "../ui/stat-card";
import { SegmentDonut } from "../charts/segment-donut";
import { AgeBarChart } from "../charts/age-bar-chart";
import { UserAnalyticsService } from "../../lib/services";

export function UserAnalyticsView() {
  const [totalUsers, setTotalUsers] = useState("0");
  const [activeUsers, setActiveUsers] = useState("0");
  const [newUsers, setNewUsers] = useState("0");
  const [churnRate, setChurnRate] = useState("0%");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const data = await UserAnalyticsService.getAnalytics();

      setTotalUsers(data.summary.total_users.toLocaleString());

      setActiveUsers(data.summary.active_users.toLocaleString());

      setNewUsers(data.summary.new_this_month.toLocaleString());

      setChurnRate(`${data.summary.churn_rate}%`);
    } catch (e) {
      console.warn("Gagal memuat analitik pengguna.", e);
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
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">User Analytics</h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">Detailed user behavior and demographics (Real-Time Database Feed)</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isLoading && (
            <span className="text-[10px] font-bold text-[#b3000d] bg-red-50 border border-red-100 rounded-full px-2.5 py-1 flex items-center gap-1.5 animate-pulse">
              <span className="w-1 h-1 bg-[#b3000d] rounded-full" />
              Loading Data
            </span>
          )}
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm shrink-0">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#b3000d]" : ""}`} />
            Sync Segments
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={totalUsers} change="All registered users" changeType="neutral" icon={<Users className="w-5 h-5 shrink-0" />} iconBgColor="bg-blue-50 text-blue-500" />

        <StatCard title="Active Users" value={activeUsers} change="Active in last 30 days" changeType="neutral" icon={<UserCheck className="w-5 h-5 shrink-0" />} iconBgColor="bg-emerald-50 text-emerald-500" />

        <StatCard title="New This Month" value={newUsers} change="New registrations" changeType="neutral" icon={<UserPlus className="w-5 h-5 shrink-0" />} iconBgColor="bg-purple-50 text-purple-500" />

        <StatCard title="Churn Rate" value={churnRate} change="Monthly churn" changeType="neutral" icon={<UserX className="w-5 h-5 shrink-0" />} iconBgColor="bg-red-50 text-red-500" />
      </div>

      {/* Charts Layout - Split Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex h-full">
          <SegmentDonut />
        </div>
        <div className="flex h-full">
          <AgeBarChart />
        </div>
      </div>
    </div>
  );
}
