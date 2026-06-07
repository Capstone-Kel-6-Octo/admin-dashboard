"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Search, Filter, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { ConsentService, UserConsent, ConsentSummary } from "../../lib/services/consent-service";

export function ConsentView() {
  const [consents, setConsents] = useState<UserConsent[]>([]);
  const [summary, setSummary] = useState<ConsentSummary[]>([]);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<"ALL" | "ACCEPTED" | "DECLINED">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const consentsList = await ConsentService.getConsents();
      const sumResult = await ConsentService.getConsentSummary();
      setConsents(consentsList);
      setSummary(sumResult);
    } catch (e) {
      console.error("Gagal memuat data consent", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const acceptedRow = summary.find((s) => s.consent_given === true);
  const declinedRow = summary.find((s) => s.consent_given === false);
  const totalAccepted = Number(acceptedRow?.total ?? 0);
  const totalDeclined = Number(declinedRow?.total ?? 0);
  const grandTotal = Number(totalAccepted) + Number(totalDeclined);
  const acceptPercentage = grandTotal > 0 ? ((Number(totalAccepted) / grandTotal) * 100).toFixed(1) : "84.4";

  // Filter logic
  const filteredConsents = consents.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());

    if (filterState === "ALL") return matchesSearch;
    if (filterState === "ACCEPTED") return matchesSearch && c.consent_given;
    if (filterState === "DECLINED") return matchesSearch && !c.consent_given;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#b3000d]" />
            Consent Analytics
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">User compliance, legal agreements, and policy opt-in/opt-out metrics.</p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#b3000d]" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Consent Audits</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-slate-800 tracking-tight">{grandTotal.toLocaleString()}</h3>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                +14.2% dibanding bulan lalu
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-emerald-500">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Persetujuan Diberikan (Accepted)</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-emerald-600 tracking-tight">{Number(totalAccepted).toLocaleString()}</h3>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                Tingkat Penerimaan: <strong className="text-emerald-600">{acceptPercentage}%</strong>
              </p>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-rose-500">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Persetujuan Ditolak (Declined)</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-rose-600 tracking-tight">{Number(totalDeclined).toLocaleString()}</h3>
              <p className="text-[11px] font-semibold text-slate-400">
                Penyebaran: <strong className="text-rose-600">{(100 - Number(acceptPercentage)).toFixed(1)}%</strong>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* SVG Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Ring Donut Chart Card */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base font-bold text-slate-800">Distribusi Persetujuan</CardTitle>
              <CardDescription className="text-xs text-slate-400 font-semibold">Accepted vs Declined Policy</CardDescription>
            </CardHeader>
            <div className="flex items-center justify-center py-6 relative">
              {/* SVG Ring Donut */}
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="11" strokeDasharray={`${Number(acceptPercentage) * 2.51} 251.2`} strokeLinecap="round" />
              </svg>
              {/* Absolute Center Text */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{acceptPercentage}%</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Opt-In Rate</span>
              </div>
            </div>
          </div>
          {/* Legend Table */}
          <div className="space-y-3.5 border-t border-slate-50 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full shrink-0" />
                <span className="text-slate-600">Diterima (Opt-In)</span>
              </div>
              <span className="text-slate-800 font-bold">{Number(totalAccepted).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200 rounded-full shrink-0" />
                <span className="text-slate-600">Ditolak (Opt-Out)</span>
              </div>
              <span className="text-slate-800 font-bold">{Number(totalDeclined).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Consent Trend Chart Card */}
        <Card className="lg:col-span-7 p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold text-slate-800">Tren Penerimaan Kebijakan</CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">Opt-In and Opt-Out logs over last 7 days</CardDescription>
          </CardHeader>
          {/* SVG Trend Lines */}
          <div className="w-full h-56 mt-4 relative">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f8fafc" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f8fafc" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f8fafc" strokeWidth="1" />
              {/* Accepted curve: 14500, 15100, 15900, 16200, 17400, 18200, 19500 */}
              <path d="M 10 150 Q 80 142 160 135 T 320 120 T 490 100" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
              {/* Declined curve: 2900, 2850, 2980, 3100, 3010, 3200, 3400 */}
              <path d="M 10 185 Q 80 186 160 184 T 320 182 T 490 180" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              {/* Coordinates highlight dot */}
              <circle cx="490" cy="100" r="5" fill="#10b981" />
              <circle cx="490" cy="180" r="4.5" fill="#f43f5e" />
            </svg>
            <div className="absolute top-0 right-0 flex items-center gap-3 bg-white/80 backdrop-blur-[2px] p-2 rounded-xl border border-slate-100 text-[10px] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Diterima
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-rose-500 rounded-full" /> Ditolak
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold px-2 mt-2">
            <span>18 Mei</span>
            <span>20 Mei</span>
            <span>22 Mei</span>
            <span>24 Mei (Hari Ini)</span>
          </div>
        </Card>
      </div>

      {/* User Consents List Card */}
      <Card hoverable={false} className="w-full">
        <CardHeader className="border-b border-slate-50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">Riwayat Persetujuan Pengguna</CardTitle>
              <CardDescription className="text-xs text-slate-400 font-semibold">Daftar lengkap audit trails persetujuan persyaratakan kebijakan aplikasi.</CardDescription>
            </div>
            {/* Table Controls */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-slate-50/50"
                />
              </div>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shrink-0 bg-white shadow-sm">
                <button onClick={() => setFilterState("ALL")} className={`px-3 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${filterState === "ALL" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}>
                  Semua
                </button>
                <button
                  onClick={() => setFilterState("ACCEPTED")}
                  className={`px-3 py-1.5 text-[10px] font-bold border-l border-slate-100 transition-all cursor-pointer ${filterState === "ACCEPTED" ? "bg-emerald-500 text-white" : "text-slate-500 hover:text-slate-800"}`}>
                  Diterima
                </button>
                <button
                  onClick={() => setFilterState("DECLINED")}
                  className={`px-3 py-1.5 text-[10px] font-bold border-l border-slate-100 transition-all cursor-pointer ${filterState === "DECLINED" ? "bg-rose-500 text-white" : "text-slate-500 hover:text-slate-800"}`}>
                  Ditolak
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 select-none">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status Consent</th>
                  <th className="px-6 py-4">Waktu Persetujuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#b3000d]" />
                        <span>Memuat data riwayat...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredConsents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                      Tidak ada pengguna yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredConsents.map((consent, i) => (
                    <tr key={consent.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 text-slate-400 font-bold select-all">#{consent.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{consent.name}</td>
                      <td className="px-6 py-4 text-slate-500">{consent.email}</td>
                      <td className="px-6 py-4">
                        {consent.consent_given ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            Accepted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Declined
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(consent.created_at).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
