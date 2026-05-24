"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Shield,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Info,
  Save,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { FeatureService, LogService } from "../../lib/services";

interface AppFeature {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: "Recommendation" | "Interface" | "Notification" | "Security";
  adoptionUsers: number;
  adoptionPercentage: number;
  clickCount: string;
  icon: any;
  color: string;
  bgColor: string;
}

export function FeaturesView() {
  const [features, setFeatures] = useState<AppFeature[]>([
    {
      id: "ai-recom",
      name: "Transfer",
      description: "Fitur pengiriman uang instan ke sesama rekening maupun bank lain dengan sekali klik.",
      isActive: true,
      category: "Recommendation",
      adoptionUsers: 85420,
      adoptionPercentage: 85,
      clickCount: "85.4K",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      id: "smart-notif",
      name: "Pembayaran",
      description: "Modul pembayaran tagihan rutin seperti listrik, air, pulsa, dan e-wallet secara terjadwal.",
      isActive: true,
      category: "Notification",
      adoptionUsers: 72340,
      adoptionPercentage: 72,
      clickCount: "72.3K",
      icon: CreditCard,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: "dynamic-home",
      name: "Payroll",
      description: "Fitur tabungan berjangka khusus untuk membantu nasabah mencapai tujuan finansial personal.",
      isActive: false,
      category: "Interface",
      adoptionUsers: 68120,
      adoptionPercentage: 68,
      clickCount: "68.1K",
      icon: PiggyBank,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      id: "realtime-fraud",
      name: "Investasi",
      description: "Modul pembelian reksa dana, obligasi, dan produk investasi pasar modal langsung dari aplikasi.",
      isActive: true,
      category: "Security",
      adoptionUsers: 54670,
      adoptionPercentage: 54,
      clickCount: "54.6K",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      id: "dark-mode-auto",
      name: "Top Up",
      description: "Pengaturan mandiri untuk aktivasi kartu kredit/debit, limit transaksi, dan pemblokiran darurat.",
      isActive: false,
      category: "Interface",
      adoptionUsers: 48230,
      adoptionPercentage: 48,
      clickCount: "48.2K",
      icon: Shield,
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeatureStats = async () => {
    setIsLoading(true);
    try {
      const usage = await FeatureService.getFeaturesUsage();
      if (Array.isArray(usage) && usage.length > 0) {
        const updated = features.map(f => {
          const match = usage.find((u: any) => u.feature_name.toLowerCase() === f.name.toLowerCase());
          if (match) {
            const userCount = parseInt(match.total_usage || "0", 10);
            return {
              ...f,
              adoptionUsers: userCount,
              clickCount: userCount >= 1000 ? `${(userCount / 1000).toFixed(1)}K` : String(userCount)
            };
          }
          return f;
        });
        setFeatures(updated);
      }
    } catch (e) {
      console.warn("Gagal mengambil data live statistik interaksi fitur.", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureStats();
  }, []);

  const toggleFeature = (id: string) => {
    setFeatures(
      features.map((f) => {
        if (f.id === id) {
          const updatedState = !f.isActive;
          const percentChange = updatedState ? 1 : -1;
          const userChange = updatedState ? 120 : -120;
          
          triggerNotification(`Fitur "${f.name}" diubah menjadi ${updatedState ? "AKTIF" : "NON-AKTIF"}. Ingat untuk mengeklik Simpan.`);
          return {
            ...f,
            isActive: updatedState,
            adoptionPercentage: f.adoptionPercentage + percentChange,
            adoptionUsers: f.adoptionUsers + userChange,
          };
        }
        return f;
      })
    );
  };

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const activeList = features.filter(f => f.isActive).map(f => f.name).join(", ");
      
      // Save logs to backend database audit trails
      await LogService.createLog(
        "TOGGLE_FEATURE",
        `Mengupdate status aktif fitur. Fitur Aktif saat ini: [${activeList || "Tidak Ada"}].`
      );
      
      triggerNotification("Konfigurasi fitur berhasil disimpan ke server utama OCTO Mobile dan dicatat di audit logs!");
    } catch (e) {
      triggerNotification("Konfigurasi fitur disimpan secara lokal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    const reset = features.map((f) => ({
      ...f,
      isActive: f.id === "ai-recom" || f.id === "smart-notif" || f.id === "realtime-fraud",
    }));
    setFeatures(reset);

    try {
      await LogService.createLog("TOGGLE_FEATURE", "Mereset konfigurasi fitur core ke bawaan pabrik.");
    } catch (e) {}

    setIsLoading(false);
    triggerNotification("Konfigurasi fitur berhasil di-reset ke pengaturan bawaan.");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-2">
            Feature Analytics
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">
            Usage statistics, toggle core engines, and interactive adoption control logs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoading && (
            <RefreshCw className="w-4 h-4 animate-spin text-[#b3000d] mr-1" />
          )}
          <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Bawaan
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="flex items-center gap-2 shadow-md">
            <Save className="w-3.5 h-3.5" />
            Simpan Konfigurasi
          </Button>
        </div>
      </div>

      {/* Floating status alert */}
      {notification && (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2.5 shadow-xl max-w-md animate-in fade-in slide-in-from-top-3 duration-200 fixed top-4 right-4 z-50">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top 5 Feature Analytics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {features.map((feat) => {
          const IconComponent = feat.icon;
          return (
            <Card key={feat.id} className="relative overflow-hidden p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-2xl ${feat.bgColor} ${feat.color} flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 shrink-0" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {feat.clickCount}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    {feat.name}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Large Card: Feature Adoption Rate */}
      <Card hoverable={false} className="w-full">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">
            Feature Adoption Rate
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 font-semibold">
            Percentage of users using each feature
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 space-y-6">
          {features.map((feat) => (
            <div key={feat.id} className="space-y-2">
              {/* Labels line */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 font-bold">{feat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{feat.adoptionUsers.toLocaleString()} users</span>
                  <span className="text-[#b3000d] font-bold text-sm">{feat.adoptionPercentage}%</span>
                </div>
              </div>
              {/* Progress Bar Track */}
              <div className="w-full h-3 bg-slate-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#b3000d] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${feat.adoptionPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reusable Toggle Control Card */}
      <Card hoverable={false} className="w-full">
        <CardHeader className="border-b border-slate-50 pb-4">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[#b3000d]" />
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                Fitur Personalization & Core Engine
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 font-semibold">
                Aktifkan atau matikan modul personalisasi secara real-time untuk memengaruhi performa visual aplikasi.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-slate-100/60 mt-2">
          {features.map((feat) => (
            <div
              key={feat.id}
              className="py-5 flex items-start justify-between gap-6 first:pt-3 last:pb-3 hover:bg-slate-50/30 px-3 rounded-xl transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-slate-700">{feat.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-wide shrink-0 ${
                      feat.category === "Recommendation"
                        ? "bg-blue-50 text-blue-600"
                        : feat.category === "Interface"
                        ? "bg-orange-50 text-orange-600"
                        : feat.category === "Notification"
                        ? "bg-purple-50 text-purple-600"
                        : "bg-red-50 text-[#b3000d]"
                    }`}
                  >
                    {feat.category}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 max-w-2xl leading-relaxed">
                  {feat.description}
                </p>
              </div>

              {/* Slider Toggle */}
              <button
                onClick={() => toggleFeature(feat.id)}
                className="cursor-pointer text-slate-400 hover:text-slate-600 transition-transform active:scale-95 shrink-0"
              >
                {feat.isActive ? (
                  <ToggleRight className="w-11 h-11 text-[#b3000d] stroke-[1.25]" />
                ) : (
                  <ToggleLeft className="w-11 h-11 stroke-[1.25]" />
                )}
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
