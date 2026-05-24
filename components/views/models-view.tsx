"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Plus, Sparkles, RefreshCw, BarChart, Sliders, CheckCircle, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ModelService, MLModel } from "../../lib/services/model-service";

export function ModelsView() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Forms states
  const [isDeploying, setIsDeploying] = useState(false);
  const [newName, setNewName] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [newAccuracy, setNewAccuracy] = useState(90);
  const [newStatus, setNewStatus] = useState("ACTIVE");

  // Editing state
  const [editingModel, setEditingModel] = useState<MLModel | null>(null);
  const [editAccuracy, setEditAccuracy] = useState(90);
  const [editStatus, setEditStatus] = useState("ACTIVE");

  const loadModels = async () => {
    setIsLoading(true);
    try {
      const modelsData = await ModelService.getModels();
      setModels(modelsData);
    } catch (e) {
      console.error("Gagal memuat models monitoring", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDeployModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newVersion.trim()) return;

    try {
      await ModelService.createModel(newName, newVersion, newAccuracy, newStatus);
      triggerNotification(`Model "${newName} v${newVersion}" berhasil dideploy!`);
      
      // Reset form
      setNewName("");
      setNewVersion("");
      setNewAccuracy(90);
      setNewStatus("ACTIVE");
      setIsDeploying(false);

      // Reload
      await loadModels();
    } catch (err) {
      triggerNotification("Error: Gagal men-deploy model baru.");
    }
  };

  const handleUpdateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    try {
      await ModelService.updateModel(editingModel.id, editAccuracy, editStatus);
      triggerNotification(`Model "${editingModel.model_name}" berhasil diperbarui!`);
      setEditingModel(null);
      await loadModels();
    } catch (err) {
      triggerNotification("Error: Gagal mengupdate model.");
    }
  };

  // KPI Computations
  const activeModelsCount = models.filter(m => m.status === "ACTIVE").length;
  const avgAccuracy = models.length > 0
    ? (models.reduce((acc, cur) => acc + Number(cur.accuracy), 0) / models.length).toFixed(1)
    : "88.4";

  const getStatusBadge = (status: string) => {
    const st = status.toUpperCase();
    if (st === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          Active
        </span>
      );
    }
    if (st === "TRAINING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
          Training
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-bold border border-slate-100">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Inactive
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-[#b3000d]" />
            Model Monitoring
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-normal mt-2">
            Real-time Machine Learning model cycles, recommenders accuracy, and deployment controls.
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <button
            onClick={loadModels}
            disabled={isLoading}
            className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-[#b3000d]" : ""}`} />
            Sync Stats
          </button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDeploying(!isDeploying)}
            className="flex items-center gap-2 shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            Deploy Model
          </Button>
        </div>
      </div>

      {/* Floating status alert */}
      {notification && (
        <div className="bg-slate-900 text-white rounded-xl px-4 py-3 text-xs font-bold flex items-center gap-2.5 shadow-xl max-w-md animate-in fade-in slide-in-from-top-3 duration-200 fixed top-4 right-4 z-50">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KPI metric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total Models Deployed</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-slate-800 tracking-tight">
                {models.length}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                Semua model rekomendasi AI
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-[#b3000d]">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Rata-rata Akurasi AI</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-[#b3000d] tracking-tight">
                {avgAccuracy}%
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <BarChart className="w-3.5 h-3.5 text-blue-500" />
                Di atas batas aman dasar (80%)
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 border-l-4 border-emerald-500">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Model Aktif (Active Serving)</span>
            <div className="space-y-1">
              <h3 className="text-3.5xl font-black text-emerald-600 tracking-tight">
                {activeModelsCount}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">
                Sedang memproses personalisasi real-time
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Model Deployment Collapsible Card */}
      {isDeploying && (
        <Card className="p-6 border border-slate-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="p-0 pb-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">Deploy Versi Model Rekomendasi Baru</CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">Deploy algoritma baru langsung ke server API produksi.</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleDeployModel} className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-5 items-end">
            <Input
              label="Nama Model"
              placeholder="Misal: RecSystem Neural"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="text-xs border-slate-200"
            />
            <Input
              label="Versi"
              placeholder="Misal: 2.5.0"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              required
              className="text-xs border-slate-200"
            />
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Akurasi (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newAccuracy}
                onChange={(e) => setNewAccuracy(Number(e.target.value))}
                required
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-slate-50/50"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Status Awal</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-slate-50/50"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="TRAINING">TRAINING</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            
            <div className="md:col-span-4 flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDeploying(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm" className="shadow-md">
                Deploy ke Produksi
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Model Parameter Edit Collapsible Card */}
      {editingModel && (
        <Card className="p-6 border border-[#b3000d]/30 shadow-lg bg-red-50/10 animate-in slide-in-from-top-4 duration-300">
          <CardHeader className="p-0 pb-4 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-[#b3000d] flex items-center gap-2">
              <Sliders className="w-5 h-5 shrink-0" />
              Sesuaikan Parameter: {editingModel.model_name}
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 font-semibold">Memodifikasi detail operasional model secara instan.</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleUpdateModel} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 items-end">
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Setel Akurasi (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={editAccuracy}
                onChange={(e) => setEditAccuracy(Number(e.target.value))}
                required
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-white"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ubah Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b3000d] bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="TRAINING">TRAINING</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-2">
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setEditingModel(null)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm" className="w-full shadow-md">
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Models List Table Card */}
      <Card hoverable={false} className="w-full">
        <CardHeader className="border-b border-slate-50 pb-4">
          <CardTitle className="text-base font-bold text-slate-800">Siklus Hidup Model Rekomendasi</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-semibold">Status akurasi, siklus latih, dan peluncuran model.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 select-none">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nama Model</th>
                  <th className="px-6 py-4">Versi</th>
                  <th className="px-6 py-4">Metrik Akurasi</th>
                  <th className="px-6 py-4">Status Deploy</th>
                  <th className="px-6 py-4">Waktu Eksekusi Terakhir</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#b3000d]" />
                        <span>Sinkronisasi model...</span>
                      </div>
                    </td>
                  </tr>
                ) : models.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Tidak ada model AI yang dideploy saat ini.
                    </td>
                  </tr>
                ) : (
                  models.map((model) => (
                    <tr key={model.id} className="hover:bg-slate-50/30 transition-all duration-200">
                      <td className="px-6 py-4 text-slate-400 font-bold select-all">#{model.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-slate-400" />
                        {model.model_name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono text-[10px] border border-slate-200/50">
                          v{model.version}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Circle radial meter */}
                          <div className="w-8 h-8 relative flex items-center justify-center">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="transparent"
                                stroke={Number(model.accuracy) >= 90 ? "#10b981" : Number(model.accuracy) >= 80 ? "#3b82f6" : "#f43f5e"}
                                strokeWidth="3"
                                strokeDasharray={`${Number(model.accuracy) * 1.0} 100`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute text-[8px] font-bold text-slate-700">{model.accuracy}%</span>
                          </div>
                          {/* Sub label accuracy description */}
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {Number(model.accuracy) >= 90 ? "Optimal" : Number(model.accuracy) >= 80 ? "Layak" : "Suboptimal"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(model.status)}</td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(model.last_run).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setEditingModel(model);
                            setEditAccuracy(Number(model.accuracy));
                            setEditStatus(model.status);
                            // Scroll up slightly to view edit panel
                            window.scrollTo({ top: 150, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#b3000d]/30 hover:bg-[#b3000d]/5 text-[10px] font-bold text-slate-600 hover:text-[#b3000d] transition-all cursor-pointer"
                        >
                          Sesuaikan
                        </button>
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
