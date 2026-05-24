"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Shield, PlusCircle, RefreshCw, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LogService, AdminLog } from "../../lib/services/log-service";

export function LogsView() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [actionInput, setActionInput] = useState("TOGGLE_FEATURE");
  const [descInput, setDescInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const logsData = await LogService.getLogs();
      setLogs(logsData);
    } catch (e) {
      console.error("Gagal mengambil log audit", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descInput.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await LogService.createLog(actionInput, descInput);
      triggerNotification(`Sukses: Audit log "${actionInput}" berhasil disimpan!`);
      setDescInput("");
      
      // Reload logs to reflect the new entry immediately
      await loadLogs();
    } catch (err: any) {
      console.error(err);
      triggerNotification(`Error: Gagal membuat log.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionBadgeStyle = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("LOGIN")) return "bg-purple-50 text-purple-700 border-purple-100";
    if (act.includes("FEATURE")) return "bg-rose-50 text-[#b3000d] border-red-100";
    if (act.includes("MODEL")) return "bg-blue-50 text-blue-700 border-blue-100";
    if (act.includes("SYNC") || act.includes("DB")) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-[#b3000d]" />
            Admin Action Logs
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">
            Real-time security audit trails and log stream of all administrative actions.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={isLoading}
          className="self-start sm:self-auto flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#b3000d]" : ""}`} />
          Refresh Stream
        </button>
      </div>

      {/* Floating status alert */}
      {notification && (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2.5 shadow-xl max-w-md animate-in fade-in slide-in-from-top-3 duration-200 fixed top-4 right-4 z-50">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Layout Split: Left timeline stream (2/3), Right manual entry simulator (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Logs Timeline Stream */}
        <Card hoverable={false} className="lg:col-span-8 w-full h-full flex flex-col">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#b3000d]" />
              Live Audit Trails Stream
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">
              Immutable sequence of system triggers and adjustments.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 max-h-[600px] overflow-y-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#b3000d]" />
                <span className="text-xs font-bold uppercase tracking-wider">Syncing log stream...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-semibold">
                Belum ada aktivitas admin yang tercatat.
              </div>
            ) : (
              <div className="relative border-l border-slate-100 ml-3 pl-6 space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative space-y-1.5 animate-in fade-in duration-200">
                    {/* Ring dot absolute badge */}
                    <span className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border border-slate-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#b3000d] shadow-[0_0_6px_#b3000d]" />
                    </span>

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border uppercase tracking-wider ${getActionBadgeStyle(log.action)}`}>
                        {log.action}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">
                        {log.name || "Administrator"}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold ml-auto shrink-0 select-none">
                        {new Date(log.created_at).toLocaleString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "numeric",
                          month: "short"
                        })}
                      </span>
                    </div>

                    {/* Log Message Description */}
                    <p className="text-xs font-semibold text-slate-500 bg-slate-50/50 rounded-xl p-3 border border-slate-100/60 leading-relaxed max-w-3xl">
                      {log.description}
                    </p>
                    
                    {/* Log UUID */}
                    <span className="text-[9px] text-slate-300 font-mono block select-all">
                      UUID: #{log.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Log Entry Simulator */}
        <Card hoverable={false} className="lg:col-span-4 p-6">
          <CardHeader className="p-0 pb-4 border-b border-slate-50">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-4.5 h-4.5 text-[#b3000d]" />
              Simulator Log Aksi
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">
              Kirimkan log tindakan manual untuk menguji integritas database.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleCreateLog} className="space-y-5 mt-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Jenis Aksi (Action)</label>
              <select
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-slate-50/60"
              >
                <option value="LOGIN">LOGIN</option>
                <option value="TOGGLE_FEATURE">TOGGLE_FEATURE</option>
                <option value="DEPLOY_MODEL">DEPLOY_MODEL</option>
                <option value="UPDATE_MODEL">UPDATE_MODEL</option>
                <option value="SYNC_DATABASE">SYNC_DATABASE</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deskripsi Aktivitas</label>
              <textarea
                placeholder="Detail tindakan yang dilakukan oleh admin..."
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                rows={4}
                required
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-slate-50/60 leading-relaxed resize-none"
              />
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-transform duration-200 active:scale-95"
            >
              Kirim Ke Audit Trails
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
